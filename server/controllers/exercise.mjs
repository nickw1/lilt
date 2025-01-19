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

    addExercise(req, res) {
        try {
            const { topic, intro, questions, moduleCode } = req.body;
            if(topic && intro && questions && topic.match("^\\d+$")) {
                const module = this.moduleDao.getModuleByCode(moduleCode);
                if(module) {
                    const topicObj = this.topicDao.getTopicByNumber(module.id, topic);
                    if(topicObj) {
                        const eid = this.exerciseDao.addExercise(topicObj.id, xss(intro), module.id);
                        if(eid > 0) {
                            const qids = this.questionDao.addQuestions(xss(eid), questions);
                            res.json({eid, qids});
                        } else {
                            res.status(500).json({error: "Could not add exercise"});
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
}
