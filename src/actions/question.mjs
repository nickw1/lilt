"use server"

import QuestionDao from '../../server/dao/question.mjs';
import db from '../../server/db/db.mjs';


export function editQuestion(id, question, options) {
    console.log(`editQuestion:`); 
	console.log(JSON.stringify(question));
	console.log(JSON.stringify(options));
    const questionDao = new QuestionDao(db);
    try {
        if(question) {
            const nUpdated = questionDao.editQuestion(id, question, options || []);
            return({nUpdated});
        } else {
            return({error: "No question text provided."});
        }
    } catch(e) {
        return({error: "Internal server error"});
    }
}

export function deleteQuestion(id) {
    const questionDao = new QuestionDao(db);
    try {
        const nUpdated = questionDao.deleteQuestion(id);
        return {nUpdated};
    } catch(e) {
        return {error: "Internal server error"};
    }
}
