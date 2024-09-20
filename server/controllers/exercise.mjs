import ExerciseDao from '../dao/exercise.mjs';
import QuestionDao from '../dao/question.mjs';
import xss from 'xss';

export default class ExerciseController {

    constructor(db) {
        this.exerciseDao = new ExerciseDao(db); 
        this.questionDao = new QuestionDao(db); 
    }

    addExercise(req, res) {
        try {
            const { topic, intro, questions } = req.body;
            if(topic && intro && questions && topic.match("^\\d+$")) {
                const eid = this.exerciseDao.addExercise(topic, intro);
                if(eid > 0) {
                    const qids = this.questionDao.addQuestions(xss(eid), questions);
                    res.json({eid, qids});
                } else {
                    res.status(500).json({error: "Could not add exercise"});
                }
            } else {
                res.status(400).json({error:"Missing or invalid topic, intro and/or questions."});
            }
        } catch(e) {
            res.status(500).json({error: "Internal server error. Probably a coding bug - please add an issue on GitHub."});
        }
    }

    getAll(req, res) {
        try {
            res.json(this.exerciseDao.getAll());
        } catch(e) {
            res.status(500).json({error: "Internal server error"});
        }
    }
}
