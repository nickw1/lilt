import ExerciseDao from '../../server/dao/exercise.mjs';
import QuestionDao from '../../server/dao/question.mjs';
import ModuleDao from '../../server/dao/module.mjs';
import TopicDao from '../../server/dao/topic.mjs';
import db from '../../server/db/db.mjs';
import xss from 'xss';


    export function addQuestionsToExercise(prevState, formData, id) {
        const exerciseDao = new ExerciseDao(db), questionDao = new QuestionDao(db);

		const questions = formData.get("questions");
        if(exerciseDao.getFullExercise(id)) {
           const qids = questionDao.addQuestions(xss(id), questions);
           return({qids});
        } else {
           return({error: `Exercise with ID ${id} not found.`});
        }
    }

    export function addExercise(prevState, formData) {
        const moduleDao = new ModuleDao(db), topicDao = new TopicDao(db), exerciseDao = new ExerciseDao(db), questionDao = new QuestionDao(db);
        try {
			const topic = formData.get("topic"), intro = formData.get("intro"), questions = formData.get("questions"), moduleCode = formData.get("moduleCode");
            if(topic && intro && questions && topic.match("^\\d+$")) {
                const module = moduleDao.getModuleByCode(moduleCode);
                if(module) {
                    const topicObj = topicDao.getTopicByNumber(module.id, topic);
                    if(topicObj) {
                        const eid = exerciseDao.addExercise(topicObj.id, xss(intro), module.id);
                        if(eid > 0 && exerciseDao.getFullExercise(eid)) {
                            const qids = questionDao.addQuestions(xss(eid), questions);
                            return({eid, qids});
                        } else {
                            return({error: "Could not add exercise or questions"});
                        }
                    } else {
                        return({error: "Could not find topic"});
                    }
                } else {
                    return({error: "Could not find module"});
                }
            } else {
                return({error:"Missing or invalid topic, intro and/or questions."});
            }
        } catch(e) {
            return({error: `Internal server error. Probably a coding bug - please add an issue on GitHub. Details: ${e.message}`});
        }
    }

    export function editExercise(prevState, formData, id) {
        const exerciseDao = new ExerciseDao(db);
        try {
			const exercise = formData.get("exercise");
            if(exercise) {
                const nUpdated = exerciseDao.editExercise(id, exercise);
                return({nUpdated});
            } else {
                return({error: "No exercise text provided."});
            }
        } catch(e) {
            return({error: "Internal server error"});
        }
    }

    export function deleteExercise(prevState, formData, id) {
        const exerciseDao = new ExerciseDao(db), questionDao = new QuestionDao(db);
        try {
            questionDao.deleteQuestionsForExercise(id); 
            const nUpdated = exerciseDao.deleteExercise(id);
            return{nUpdated});
        } catch(e) {
            return({error: e.message});
        }
    }
