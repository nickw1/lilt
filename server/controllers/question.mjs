import QuestionDao from '../dao/question.mjs';

export default class QuestionController {

    constructor(db) {
        this.questionDao = new QuestionDao(db); 
    }

    editQuestion(req, res) {
        try {
            if(req.body.question) {
                const nUpdated = this.questionDao.editQuestion(req.params.id, req.body.question, req.body.options || []);
                res.status(nUpdated ? 200 : 404).json({nUpdated});
            } else {
                res.status(400).json({error: "No question text provided."});
            }
        } catch(e) {
            res.status(500).json({error: "Internal server error"});
        }
    }

    deleteQuestion(req, res) {
        try {
            const nUpdated = this.questionDao.deleteQuestion(req.params.id);
            res.status(nUpdated ? 200 : 404).json({nUpdated});
        } catch(e) {
            res.status(500).json({error: "Internal server error"});
        }
    }
}
