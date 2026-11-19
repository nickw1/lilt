"use server"

import ExerciseDao from '../dao/exercise.mjs';
import QuestionDao from '../dao/question.mjs';
import ModuleDao from '../dao/module.mjs';
import TopicDao from '../dao/topic.mjs';
import Controller from '../controllers/controller';
import db from '../db';
import useLoggedIn from '../misc/login';
import xss from 'xss';
import { getRequest } from 'tinyrsc/server';
import type { Exercise, Question, AddExerciseReturn, SetUnlockedReturn } from '../types';


export async function addQuestionsToExercise(id: number, questions: Question[]) {
    const request = getRequest()!;
    const { isAdmin } = await useLoggedIn(request);
    if (!isAdmin) {
        return { "error": "Only admins can add questions to an exercise." };
    }
    const exerciseDao = new ExerciseDao(db), questionDao = new QuestionDao(db);

    if (id.toString().match("^\\d+$") && exerciseDao.getFullExercise(id)) {
        const qids = questionDao.addQuestions(id, questions);
        return ({ qids });
    } else {
        return ({ error: `Exercise with ID ${id} not found or invalid ID.` });
    }
}

export async function addExercise(exData: Exercise): Promise<AddExerciseReturn> {
    const request = getRequest()!;
    const { isAdmin } = await useLoggedIn(request);
    if (!isAdmin) {
        return { "error": "Only admins can add an exercise." };
    }
    const moduleDao = new ModuleDao(db), topicDao = new TopicDao(db), exerciseDao = new ExerciseDao(db), questionDao = new QuestionDao(db);
    try {
        const { topic, intro, questions, moduleCode } = exData;
        if (topic && intro && questions && topic.toString().match("^\\d+$")) { // TODO may not be necessary if we know topic is a number
            const module = moduleDao.getModuleByCode(moduleCode);
            if (module) {
                const topicObj = topicDao.getTopicByNumber(module.id, topic);
                if (topicObj) {
                    const eid = exerciseDao.addExercise(topicObj.id, xss(intro), module.id);
                    if (eid > 0 && exerciseDao.getFullExercise(eid)) {
                        const qids = questionDao.addQuestions(xss(eid), questions);
                        return ({ eid, qids });
                    } else {
                        return ({ error: "Could not add exercise or questions" });
                    }
                } else {
                    return ({ error: "Could not find topic" });
                }
            } else {
                return ({ error: "Could not find module" });
            }
        } else {
            return ({ error: "Missing or invalid topic, intro and/or questions." });
        }
    } catch (e: any) {
        return ({ error: `Internal server error. Probably a coding bug - please add an issue on GitHub. Details: ${e.message}` });
    }
}

export async function editExercise(id: number, exerciseText: string) {
    const request = getRequest()!;
    const { isAdmin } = await useLoggedIn(request);
    if (!isAdmin) {
        return { "error": "Only admins can edit an exercise." };
    }
    const exerciseDao = new ExerciseDao(db);
    try {
        if (exerciseText && id.toString().match("^\\d+$")) {
            const nUpdated = exerciseDao.editExercise(id, exerciseText);
            return ({ nUpdated });
        } else {
            return ({ error: "No exercise text provided." });
        }
    } catch (e) {
        return ({ error: "Internal server error" });
    }
}

export async function deleteExercise(id: number) {
    if (id.toString().match("^\\d+$")) {
        const request = getRequest()!;
        const { isAdmin } = await useLoggedIn(request);
        if (!isAdmin) {
            return { "error": "Only admins can delete an exercise." };
        }
        const controller = new Controller(db);
        return controller.deleteExercise(id);
    }
    return { "error": "Invalid ID." };
}

export async function setUnlocked(id: number, unlockStatus: boolean): Promise<SetUnlockedReturn> {
    if (id.toString().match("^\\d+$")) {
        const request = getRequest()!;
        const { isAdmin } = await useLoggedIn(request);
        if (!isAdmin) {
            return { "error": "Only admins can unlock an exercise." };
        }
        const exerciseDao = new ExerciseDao(db);
        const result = exerciseDao.setUnlocked(id, unlockStatus);
        if (result == 1) {
            const topicDao = new TopicDao(db);
            topicDao.markUpdatedByExercise(id);
            return { unlockStatus };
        }
        return { "error": "ID not a number." }
    }
    return { "error": "Invalid ID." };
}
