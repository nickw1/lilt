"use server"

import db from '../db/db.mjs';
import AnswerDao from '../dao/answer.mjs';
import UserDao from '../dao/user.mjs';
import QuestionDao from '../dao/question.mjs';
import TopicDao from '../dao/topic.mjs';
import useLoggedIn from '../hooks/login.mjs';
import xss from 'xss';


export async function answerQuestions(prevState, formData) {
    const answerDao = new AnswerDao(db);
    const { uid } = await useLoggedIn(); 
    const answered = [];
    if(uid !== null) {
        const status = [];
        let nAnswered = 0;
        for(let [key, answer] of formData) {
            const qid = key.substr(1);
            if(qid && answer && qid.match("^\\d+$")) {
                const info = answerDao.addAnswer(xss(uid), xss(qid), xss(answer));
                if(info === null) {
                    status.push(`Question ${qid} already answered, ignoring.`);
                } else if (info.changes) {
                    answered.push(qid);
                }
            }
        }
        return {
            status: status.length > 0 ? status: "Answered all questions", 
            answered
        };
    } else {
        return {"error": "Not logged in / invalid user"};
    }
}

export function authoriseQuestionAnswers(prevState, formData) {
    const answerDao = new AnswerDao(db), topicDao = new TopicDao(db);
    let qid = formData.get("qid");
    if(qid && qid.match("^\\d+$")) {
        qid = parseInt(qid);
        const authorised = answerDao.authoriseQuestionAnswers(qid);
        if(authorised) {
            topicDao.updateTopicOnAuthorisationByQuestion(qid);
            const newState = structuredClone(prevState);
            newState.push(qid);
            return newState;
        }
    }
    return prevState;
}

export function getAnswersForExercise(id) {
    const answerDao = new AnswerDao(db);
    return answerDao.getAnswersForExercise(id);
}
