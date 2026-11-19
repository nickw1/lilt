import { Fragment } from 'react';
import Markdown, { MarkdownToJSX, RuleType } from 'markdown-to-jsx';
import SyntaxHighlight from './SyntaxHighlight';
import fs from 'fs/promises';
//import ExerciseComponent from './ExerciseComponent.jsx';
import TopicListComponent from './TopicListComponent';
import TopicNavComponent from './TopicNavComponent';
import ExerciseComponent from './ExerciseComponent';
import MathRenderer from './MathRenderer';
import TopicDao from '../dao/topic.mjs';
import ExerciseDao from '../dao/exercise.mjs';
import AnswerDao from '../dao/answer.mjs';
import getLoginStatus from '../misc/login';
import type { NotesProps, Topic } from '../types';

import db from '../db';

import katex from 'katex';

import { getRequest } from 'tinyrsc/server';

//import Latex from 'react-latex-next';



export default async function NotesComponent({ module, initTopic }: NotesProps) {
    const topicDao = new TopicDao(db);
    const exerciseDao = new ExerciseDao(db);
    const answerDao = new AnswerDao(db);

    let keyCount = 0, topicDetail: Topic | null = null;

    const request = getRequest()!;
    const { isAdmin, uid } = await getLoginStatus(request);
    const hiddenExercises: number[] = [];

    function exerciseHandler(ex: string, dep?: number) {
        let exDependencyCompleted = isAdmin || dep === undefined;
        const depExer = exerciseDao.getExerciseByPublicNumber(topicDetail!.id, dep);
        if (!exDependencyCompleted) {
            exDependencyCompleted = depExer?.id ? answerDao.hasUserCompletedExercise(uid, depExer.id) : true;
        }
        let content: React.ReactNode;
        if (exDependencyCompleted || depExer?.unlocked == 1 || topicDetail!.visibility == 1) {
            // load exercise
            const exer = exerciseDao.getExerciseByPublicNumber(topicDetail!.id, ex);
            const completed = answerDao.hasUserCompletedExercise(uid, exer.id);
            const exercise = exerciseDao.getFullExercise(exer.id);
            //content = <p>Exercise with ID {exer.id} will go here</p>;
            content = exercise === null ? <p><strong>Error:</strong>Cannot find exercise {ex} (ID {exer.id})</p> : <Fragment key={`ex-${exer.id}`}><ExerciseComponent exercise={exercise} submittable={!completed && topicDetail!.visibility == 0} /></Fragment>;
        } else if (dep !== undefined) {
            hiddenExercises.push(parseInt(ex));
            content = uid !== null && hiddenExercises.indexOf(dep) == -1 ? <p style={unauthorisedStyle} key={`ex-unauthorised-${ex}-${dep}`}>This content is hidden as you need to complete exercise {dep} first.</p> : "";
        }
        return <div key={`ex-heading-${ex}`}><h2>Exercise {ex}</h2>{content}</div>;
    }

    function renderRuleHandler(next: () => React.ReactNode, node: MarkdownToJSX.ASTNode, renderChildren: MarkdownToJSX.ASTRender) {
        let matches = null, exMatch = null;
        if (node.type == RuleType.paragraph && node.children[0].type == RuleType.text) {

            matches = /^@(answer|depends)\((\d+)\)$/.exec(node.children[0].text);
            exMatch = /^@(ex\d+)(\((\d+)\))?$/.exec(node.children[0].text);
        }
        if (matches) {

            const heading = <h2 key={`answer-title-${matches[2]}`}>Answer to exercise {matches[2]}</h2>;
            protectedContent = true;
            const exer = exerciseDao.getExerciseByPublicNumber(topicDetail!.id, matches[2]);
            dependencyCompleted = isAdmin || topicDetail!.visibility == 1 || exer.unlocked == 1 || answerDao.hasUserCompletedExercise(uid, exer.id);
            if (dependencyCompleted) {
                return matches[1] == "answer" ? heading : ""; // return nothing for depends, switch to protected content
            } else {
                const dependency = parseInt(matches[2]);
                return uid === null || hiddenExercises.indexOf(dependency) != -1 ? "" : <div key={`hidden-content-ex-${matches[2]}-${keyCount++}`}>{matches[1] == "answer" ? heading : <h3>Protected content</h3>}<p style={unauthorisedStyle} key={`hidden-content-${keyCount++}`}>This content is hidden as you need to complete exercise {dependency} first.</p></div>;
            }

        } else if (node.type == RuleType.text && node.text.startsWith("@public")) {
            protectedContent = false;
            dependencyCompleted = false;
        } else if (exMatch) {
            const exNum = exMatch[1].substring(2);
            const exer = exerciseDao.getExerciseByPublicNumber(topicDetail!.id, exNum);
            return uid === null && exer.unlocked != 1 && topicDetail!.visibility != 1 ?
                <div key={`ex-${exNum}-notloggedin`}><h2>Exercise {exNum}</h2><p style={unauthorisedStyle} key={`ex-login-needed-${exNum}`}>You must be logged in to attempt exercise {exNum}.</p></div> : exerciseHandler(exNum, parseInt(exMatch[3]));
        } else {
            //const fixed = node.text?.replace(/\\\\/g, "\\");
            if (node.type == RuleType.codeBlock && (!protectedContent || dependencyCompleted)) {
                if(node.lang === undefined) console.warn(`!!!!! Node type is codeBlock with no language (maybe unexpected). Content is ${node.text}`);
                if (node.lang == 'math') {
                    const renderedMath = katex.renderToString(node.text, { output: "html" });
                    return <MathRenderer math={renderedMath} />;
                } else {
                    return (
                        <SyntaxHighlight key={`module-${module}-topic-${topic}-code-${keyCount++}`} lang={node.lang}>
                            {node.text}
                        </SyntaxHighlight>
                    )
                }
            }
            return protectedContent && node.type != RuleType.paragraph && !dependencyCompleted ? "" : next();
        }
    }


    const topicsList = topicDao.getAllForModule(module, true);
    const topic = (initTopic && `${initTopic}`.match("^\\d+$")) ? initTopic : 0;

    const completedStyle = {
        backgroundColor: '#c0ffc0',
        margin: '4px',
        borderRadius: '4px',
    };

    const unauthorisedStyle = {
        backgroundColor: '#ffc0c0',
        margin: '4px',
        borderRadius: '4px',
    };

    let content = <></>; // placeholder
    let protectedContent = false, dependencyCompleted = false;

    if (topic > 0) {
        topicDetail = topicDao.getTopicByModuleCodeAndNumber(module, topic);
        if (topicDetail !== null) {
            try {
                const mdstring = await fs.readFile(`${process.env.RESOURCES}/${module}/${topic}.md`, 'utf-8');

                content = <main>
                    {topicDetail.visibility == 2 && !isAdmin ?
                        <p>This content is currently not available.</p> :
                        <div>
                            <header className='notesHeader'>
                                <h1>Topic {topicDetail.number}</h1>
                                <h1>{topicDetail.title}</h1></header>
                            <Markdown options={{
                                renderRule: renderRuleHandler
                            }}>{mdstring}</Markdown>
                        </div>}
                </main>;
            } catch (e: any) {
                content = <p>Error: {e.code == 'ENOENT' ? `Notes for ${module}, topic ${topic} not found.` : e.code}</p>;
            }
        }
    }
    const adminLink = isAdmin ? <a href='/admin'>Admin Page</a> : "";

    const displayedTopics = topic == 0 ?
        <>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
                {adminLink}
            </div>
            <TopicListComponent moduleCode={module} topics={topicsList} />
        </> :
        <div style={{ display: 'flex', justifyContent: isAdmin ? 'space-between' : 'end' }}>
            {adminLink}
            <TopicNavComponent moduleCode={module} topics={topicsList}
                currentTopic={topic} />
        </div>;
    return (
        <div>
            {displayedTopics}
            <div>{content}</div>
        </div>
    );
}
