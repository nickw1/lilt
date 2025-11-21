import db from '../db/db.mjs';
import ExerciseDao from '../dao/exercise.mjs';
import AnswerDao from '../dao/answer.mjs';


export default class ExerciseController {
    constructor(db) {
        this.db = db;
    }

    getExerciseById(req, res) {
        const match = req.params.id.match("^\\d+$");
        if(match) {
            const exerciseDao = new ExerciseDao(this.db);
            res.json(exerciseDao.getFullExercise(req.params.id));
        } else {
            res.status(500).json({error: "Invalid format for exercise ID"});
        }
    }

    getAnswersForExercise(req, res) {
        if(!req.session.admin) {
            res.status(401).json({error: "Only admins can get exercise answers."});
        } else {
            const match = req.params.id.match("^\\d+$");
            if(match) {
                const answerDao = new AnswerDao(this.db);
                res.json(answerDao.getAnswersForExercise(req.params.id));
            } else {
                res.status(500).json({error: "Invalid format for exercise ID"});
            }
        }
    }
}

