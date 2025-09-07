import QuestionDao from '../dao/question.mjs';
import ExerciseDao from '../dao/exercise.mjs';
import TopicDao from '../dao/topic.mjs';
import ModuleDao from '../dao/module.mjs';
import db from '../db/db.mjs';

export default class Controller {

    constructor(db) {
        this.moduleDao = new ModuleDao(db);
        this.topicDao = new TopicDao(db);
        this.exerciseDao = new ExerciseDao(db);
        this.questionDao = new QuestionDao(db);
    }
        
    deleteExercise(id) {
        if(id.toString().match("^\\d+$")) {
            try {
                this.questionDao.deleteQuestionsForExercise(id); 
                const nUpdated = this.exerciseDao.deleteExercise(id);
                return{nUpdated};
            } catch(e) {
                return({error: e.message});
            }
        } else {
            return { error: "Invalid format for ID." };
        }
    }

    deleteTopic(id) {
        const errors = [];
        if(id.toString().match("^\\d+$")) {
            const exercises = this.exerciseDao.getExercisesForTopic(id);
            for(const e of exercises) {
                const exerciseDeleteStatus = this.deleteExercise(e.id);
                if(exerciseDeleteStatus.error) {
                    errors.push(exerciseDeleteStatus.error);
                }
            }
            if(errors.length === 0) this.topicDao.deleteTopic(id);
            return { errors };
        } else {
            return { errors: ["Invalid format for topic ID."] };
        }
    }

    deleteModule(id) {
        const errors = [];
        if(id.toString().match("^\\d+$")) {
            const moduleInfo = this.moduleDao.getTopicsForModule(id);
            for(const topic of moduleInfo) { 
                const topicDeleteStatus = this.deleteTopic(topic.id);
                if(topicDeleteStatus.errors) {
                    errors.push(...topicDeleteStatus.errors);
                }
            }
            if(errors.length === 0) this.moduleDao.deleteModule(id);
            return { errors };
        } else {
            return { errors: ["Invalid format for module ID."] };
        }
    }
}
