import ExerciseDao from '../dao/exercise.mjs';
import QuestionDao from '../dao/question.mjs';
import ModuleDao from '../dao/module.mjs';
import TopicDao from '../dao/topic.mjs';
import xss from 'xss';

export default class ExerciseController {

    constructor(db) {
        this.exerciseDao = new ExerciseDao(db); 
        this.questionDao = new QuestionDao(db); 
        this.moduleDao = new ModuleDao(db); 
        this.topicDao = new TopicDao(db); 
    }

    addQuestionsToExercise(req, res) {
        if(this.exerciseDao.getFullExercise(req.params.id)) {
           const qids = this.questionDao.addQuestions(xss(req.params.id), req.body.questions);
           res.json({qids});
        } else {
           res.status(404).json({error: `Exercise with ID ${req.params.id} not found.`});
        }
    }

    addExercise(req, res) {
        try {
            const { topic, intro, questions, moduleCode } = req.body;
            if(topic && intro && questions && topic.match("^\\d+$")) {
                const module = this.moduleDao.getModuleByCode(moduleCode);
                if(module) {
                    const topicObj = this.topicDao.getTopicByNumber(module.id, topic);
                    if(topicObj) {
                        const eid = this.exerciseDao.addExercise(topicObj.id, xss(intro), module.id);
                        if(eid > 0 && this.exerciseDao.getFullExercise(eid)) {
                            const qids = this.questionDao.addQuestions(xss(eid), questions);
                            res.json({eid, qids});
                        } else {
                            res.status(500).json({error: "Could not add exercise or questions"});
                        }
                    } else {
                        res.status(404).json({error: "Could not find topic"});
                    }
                } else {
                    res.status(404).json({error: "Could not find module"});
                }
            } else {
                res.status(400).json({error:"Missing or invalid topic, intro and/or questions."});
            }
        } catch(e) {
            res.status(500).json({error: `Internal server error. Probably a coding bug - please add an issue on GitHub. Details: ${e.toString()}`});
            throw e;
        }
    }

    getAll(req, res) {
        try {
            const exAll = this.exerciseDao.getAll();
            exAll.forEach ( ex => {
                const topic = this.topicDao.getTopicById(ex.topic);
                ex.topicNumber = topic.number;
            });
            res.json(exAll);
        } catch(e) {
            res.status(500).json({error: "Internal server error"});
        }
    }

    editExercise(req, res) {
        try {
            if(req.body.exercise) {
                const nUpdated = this.exerciseDao.editExercise(req.params.id, req.body.exercise);
                res.status(nUpdated ? 200 : 404).json({nUpdated});
            } else {
                res.status(400).json({error: "No exercise text provided."});
            }
        } catch(e) {
            res.status(500).json({error: "Internal server error"});
        }
    }

    deleteExercise(req, res) {
        try {
            const nUpdated = this.exerciseDao.deleteExercise(req.params.id);
            res.status(nUpdated ? 200 : 404).json({nUpdated});
        } catch(e) {
            res.status(500).json({error: "Internal server error"});
        }
    }
}
