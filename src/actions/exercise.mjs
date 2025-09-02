"use server"

import ExerciseDao from '../dao/exercise.mjs';
import QuestionDao from '../dao/question.mjs';
import ModuleDao from '../dao/module.mjs';
import TopicDao from '../dao/topic.mjs';
import db from '../db/db.mjs';
import xss from 'xss';


export function addQuestionsToExercise(id, questions) {
    const exerciseDao = new ExerciseDao(db), questionDao = new QuestionDao(db);

    if(id.toString().match("^\\d+$") && exerciseDao.getFullExercise(id)) {
       const qids = questionDao.addQuestions(id, questions);
       return({qids});
    } else {
       return({error: `Exercise with ID ${id} not found or invalid ID.`});
    }
}

export function addExercise(exData) {
    const moduleDao = new ModuleDao(db), topicDao = new TopicDao(db), exerciseDao = new ExerciseDao(db), questionDao = new QuestionDao(db);
    try {
        const { topic, intro, questions, moduleCode } = exData;
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

export function editExercise(id, exercise) {
    const exerciseDao = new ExerciseDao(db);
    try {
        if(exercise && id.toString().match("^\\d+$")) {
            const nUpdated = exerciseDao.editExercise(id, exercise);
            return({nUpdated});
        } else {
            return({error: "No exercise text provided."});
        }
    } catch(e) {
        return({error: "Internal server error"});
    }
}

export function deleteExercise(id) {
    if(id.toString().match("^\\d+$")) {
        const exerciseDao = new ExerciseDao(db), questionDao = new QuestionDao(db);
        try {
            questionDao.deleteQuestionsForExercise(id); 
            const nUpdated = exerciseDao.deleteExercise(id);
            return{nUpdated};
        } catch(e) {
            return({error: e.message});
        }
    } else {
        return { error: "Invalid format for ID." };
    }
}

export function getFullExercise(id) {
    if(id.toString().match("^\\d+$")) {
        const exerciseDao = new ExerciseDao(db); 
        const ex = exerciseDao.getFullExercise(id);
        return ex;
    } else {
        return { error: "Invalid format for ID." };
    }
}
