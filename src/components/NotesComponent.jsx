import React, { Fragment, cache } from 'react';
import Markdown, { RuleType } from 'markdown-to-jsx';
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
    let contentHiddenCount=0, topicDetail;

    const { isAdmin, uid } = await useLoggedIn();
    const hiddenExercises = [];

    function exerciseHandler(ex, dep) {
        let exDependencyCompleted = isAdmin || dep === undefined;
        if(!exDependencyCompleted) {
            const depExer = exerciseDao.getExerciseByPublicNumber(topicDetail.id, dep); 
            exDependencyCompleted = depExer?.id ? answerDao.hasUserCompletedExercise(uid, depExer.id) : true;
        } 
        if(exDependencyCompleted) {
            // load exercise
            const exer = exerciseDao.getExerciseByPublicNumber(topicDetail.id, ex);
            if(answerDao.hasUserCompletedExercise(uid, exer.id)) {
                return <p style={completedStyle} key={`ex-completed-${ex}`}>You have completed exercise {ex}.</p>;
            } else {
                const exercise = exerciseDao.getFullExercise(exer.id);
                return <Fragment key={`ex-${exer.id}`}><h2>Exercise {ex}</h2><ExerciseComponent exercise={exercise} /></Fragment>;
            }
         } else {
            hiddenExercises.push(parseInt(ex));
            return uid !== null && hiddenExercises.indexOf(dep) == -1 ? <p style={unauthorisedStyle} key={`ex-unauthorised-${ex}-${dep}`}>This content is hidden as you need to complete exercise {dep} first.</p>: "";
         }
    }

    function renderRuleHandler (next, node, renderChildren) {
        let matches = null, exMatch = null;
        if(node.type == RuleType.paragraph && node.children[0].type == RuleType.text) {

            matches =  /^@(answer|depends)\((\d+)\)$/.exec(node.children[0].text);
            exMatch = /^@(ex\d+)(\((\d+)\))?$/.exec(node.children[0].text);
        }
        if(matches) {
            protectedContent = true;
            const exer = exerciseDao.getExerciseByPublicNumber(topicDetail.id, matches[2]);
            dependencyCompleted = isAdmin || answerDao.hasUserCompletedExercise(uid, exer.id);
            if(dependencyCompleted) {
                  return matches[1] == "answer" ? <h2 key={`answer-title-${matches[2]}`}>Answer to exercise {matches[2]}</h2> : ""; // return nothing for depends, switch to protected content
            } else {
                const dependency = parseInt(matches[2]);
                return uid === null || hiddenExercises.indexOf(dependency) != -1 ? "" : <p style={unauthorisedStyle} key={`hidden-content-${contentHiddenCount++}`}>This content is hidden as you need to complete exercise {dependency} first.</p>;
            }
        } else if (node.type == RuleType.text && node.text.startsWith("@public")) {
            protectedContent = false;
            dependencyCompleted = false;
        } else if (exMatch) {
            const exNum = exMatch[1].substring(2);
            return uid === null ? 
                <p style={unauthorisedStyle} key={`ex-login-needed-${exNum}`}>You must be logged in to attempt exercise {exNum}.</p> : exerciseHandler(exNum, parseInt(exMatch[3]));
        } else {
//            return protectedContent && node.type == RuleType.text && !dependencyCompleted ? "": next(); 
            return protectedContent && node.type != RuleType.paragraph && !dependencyCompleted ? "": next(); 

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
    const displayedTopics = topic == 0 ? 
            <TopicListComponent module={module} topicsList={topicsList} /> :
            <TopicNavComponent module={module} topicsList={topicsList} currentTopic={topic} /> ;
               
    return <div>
        {displayedTopics}
        <div>{content}</div>
        </div>;
}
