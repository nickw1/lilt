import React, { Fragment, cache } from 'react';
import { Link } from '@lazarv/react-server/navigation';
import Markdown, { RuleType } from 'markdown-to-jsx';
import SyntaxHighlight from './SyntaxHighlight.jsx';
import fs from 'fs/promises';
import ExerciseComponent from './ExerciseComponent.jsx';
import TopicListComponent from './TopicListComponent.jsx';
import TopicNavComponent from './TopicNavComponent.jsx';
import TopicDao from '../dao/topic.mjs';
import ExerciseDao from '../dao/exercise.mjs';
import AnswerDao from '../dao/answer.mjs';
import useLoggedIn from '../hooks/login.mjs';

import db from '../db/db.mjs';

const topicDao = new TopicDao(db);
const exerciseDao = new ExerciseDao(db);
const answerDao = new AnswerDao(db);


export default async function NotesComponent({module, initTopic}) {
    let keyCount=0, topicDetail;

    const { isAdmin, uid } = await useLoggedIn();
    const hiddenExercises = [];

    function exerciseHandler(ex, dep) {
        let exDependencyCompleted = isAdmin || dep === undefined;
        if(!exDependencyCompleted) {
            const depExer = exerciseDao.getExerciseByPublicNumber(topicDetail.id, dep); 
            exDependencyCompleted = depExer?.id ? answerDao.hasUserCompletedExercise(uid, depExer.id) : true;
        } 
        let content = "";
        if(exDependencyCompleted || topicDetail.visibility == 1) {
            // load exercise
            const exer = exerciseDao.getExerciseByPublicNumber(topicDetail.id, ex);
            const completed = answerDao.hasUserCompletedExercise(uid, exer.id);
            const exercise = exerciseDao.getFullExercise(exer.id);
            content = <Fragment key={`ex-${exer.id}`}><ExerciseComponent exercise={exercise} submittable={!completed && topicDetail.visibility == 0} /></Fragment>;
         } else {
            hiddenExercises.push(parseInt(ex));
            content = uid !== null && hiddenExercises.indexOf(dep) == -1 ? <p style={unauthorisedStyle} key={`ex-unauthorised-${ex}-${dep}`}>This content is hidden as you need to complete exercise {dep} first.</p>: "";
         }
         return <div key={`ex-heading-${ex}`}><h2>Exercise {ex}</h2>{content}</div>;
    }

    function renderRuleHandler (next, node, renderChildren) {
        let matches = null, exMatch = null;
        if(node.type == RuleType.paragraph && node.children[0].type == RuleType.text) {

            matches =  /^@(answer|depends)\((\d+)\)$/.exec(node.children[0].text);
            exMatch = /^@(ex\d+)(\((\d+)\))?$/.exec(node.children[0].text);
        }
        if(matches) {
            const heading = <h2 key={`answer-title-${matches[2]}`}>Answer to exercise {matches[2]}</h2>;
            protectedContent = true;
            const exer = exerciseDao.getExerciseByPublicNumber(topicDetail.id, matches[2]);
            dependencyCompleted = isAdmin || answerDao.hasUserCompletedExercise(uid, exer.id) || topicDetail.visibility == 1;
            if(dependencyCompleted) {
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
            return uid === null && topicDetail.visibility != 1 ? 
                <div key={`ex-${exNum}-notloggedin`}><h2>Exercise {exNum}</h2><p style={unauthorisedStyle} key={`ex-login-needed-${exNum}`}>You must be logged in to attempt exercise {exNum}.</p></div> : exerciseHandler(exNum, parseInt(exMatch[3]));
        } else {
            return protectedContent && node.type != RuleType.paragraph && !dependencyCompleted ? "" : (
                node.type == RuleType.codeBlock ?
                    <SyntaxHighlight key={`module-${module}-topic-${topic}-code-${keyCount++}`} lang={node.lang}>
                    {node.text}
                    </SyntaxHighlight> 
                    : next()
            );
        }
    }


    const topicsList = topicDao.getAllForModule(module, isAdmin);
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
 
    let content = ''; // placeholder
    let protectedContent = false, dependencyCompleted = false;

    if(topic > 0) {
        topicDetail = topicDao.getTopicByModuleCodeAndNumber(module, topic);
        try {
            const mdstring =  (await fs.readFile(`${process.env.RESOURCES}/${module}/${topic}.md`)).toString();

            content = <main>
                <header className='notesHeader'>
                <h1>Topic {topicDetail.number}</h1>
                <h1>{topicDetail.title}</h1></header>
                <Markdown options={{
                    renderRule: renderRuleHandler
                }}>{mdstring}</Markdown>
            </main>;
        } catch(e) {
            content = <p>Error: {e.code == 'ENOENT' ? `Notes for ${module}, topic ${topic} not found.` : e.code}</p>;
        }
    }
    const adminLink = <Link to='/admin'>Admin Page</Link>
    const displayedTopics = topic == 0 ?  
            <>
            <div style={{display: 'flex', justifyContent: 'end'}}>
            {adminLink}
            </div>
            <TopicListComponent module={module} topicsList={topicsList} />
            </> :
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
            {adminLink}
            <TopicNavComponent module={module} topicsList={topicsList} 
             currentTopic={topic} />
             </div> ;

    return <div>
        {displayedTopics}
        <div>{content}</div>
        </div>;
}
