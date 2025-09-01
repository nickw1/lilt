"use server"

import QuestionDao from '../../server/dao/question.mjs';
import db from '../../server/db/db.mjs';


export function editQuestion(id, question, options) {
    const questionDao = new QuestionDao(db);
    try {
        if(question && id.toString().match("^\\d+$")) {
            const nUpdated = questionDao.editQuestion(id, question, options || []);
            return({nUpdated});
        } else {
            return({error: "No question text provided or invalid ID."});
        }
    } catch(e) {
        return({error: "Internal server error"});
    }
}

export function deleteQuestion(id) {
	if(id.toString().match("^\\d+$")) {
    	const questionDao = new QuestionDao(db);
    	try {
        	const nUpdated = questionDao.deleteQuestion(id);
        	return {nUpdated};
    	} catch(e) {
        	return {error: "Internal server error"};
    	}
	} else {
		return { error: "Invalid ID." };
	}
}
