import QuestionDao from '../../server/dao/question.mjs';
import db from '../../server/db/db.mjs';


    export function editQuestion(prevState, formData, id) {
		const questionDao = new QuestionDao(db);
        try {
			const question = formData.get("question"), options = formData.get("options");
            if(question) {
                const nUpdated = questionDao.editQuestion(question, options || []);
                return({nUpdated});
            } else {
                return({error: "No question text provided."});
            }
        } catch(e) {
            return({error: "Internal server error"});
        }
    }

    export function deleteQuestion(prevState, formData, id) {
		const questionDao = new QuestionDao(db);
        try {
            const nUpdated = questionDao.deleteQuestion(id);
            return({nUpdated});
        } catch(e) {
            return({error: "Internal server error"});
        }
    }
