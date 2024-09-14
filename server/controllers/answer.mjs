import AnswerDao from '../dao/answer.mjs';
import UserDao from '../dao/user.mjs';
import QuestionDao from '../dao/question.mjs';

export default class AnswerController {

    constructor(db) {
        this.answerDao = new AnswerDao(db); 
        this.userDao = new UserDao(db); 
        this.questionDao = new QuestionDao(db);
    }

    answerQuestion(req, res) {
        const { qid, answer } = req.body;
        const uid = req.session?.uid || 0;

        if(qid && answer && uid) {
            if(this.userDao.findUserById(uid) && this.questionDao.findQuestion(qid)) {
                const info = this.answerDao.addAnswer(uid, qid, answer);
                if(info === null) {
                    res.status(400).json({error: "Question already answered."});
                } else {
                    res.status(info.changes ? 200:500).json({answerAdded: info.changes==1});
                }
            } else {
                res.status(404).json({error: "User and/or question ID not found."});
            }
        } else {
            res.status(400).json({error: "Input data not supplied."});
        }
    } 

    authoriseAnswer(req, res) {
        if(req.params.id) {
            if(this.answerDao.findAnswer(req.params.id)) {
                const authorised = this.answerDao.authoriseAnswer(req.params.id);
                res.status(authorised ? 200:500).json({authorised});
            } else {
                res.status(404).json({error: "Answer ID not found."});
            }
        } else {
            res.status(400).json({error: "Answer ID not supplied."});
        } 
    }

    getAnswersForExercise(req, res) {
        const results = this.answerDao.getAnswersForExercise(req.params.eid);
        res.json(results);
    }
}
