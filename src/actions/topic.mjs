"use server"

import db from '../db/db.mjs'
import TopicDao from '../dao/topic.mjs';
import ModuleDao from '../dao/module.mjs';
import Controller from '../controllers/controller.mjs';
import xss from 'xss';

export function makePublic(id) {
    const topicDao = new TopicDao(db);
    if(id && id.toString().match("^\\d+$")) {
        const info = topicDao.makePublic(id);
        return info.changes > 0 ? { nUpdated: info.changes } : { error: "Could not find topic with that ID." };
    } else {
        return { error: "No ID supplied." };
    }
}

export function addTopic(moduleCode, number, title) {
    const topicDao = new TopicDao(db), moduleDao = new ModuleDao(db);
    if(moduleCode && number && title && number.match("^\\d+$")) {
        const moduleInfo = moduleDao.getModuleByCode(xss(moduleCode));
        if(moduleInfo) {
            const id = topicDao.addTopic(moduleInfo.id, xss(number), xss(title));
            if(id > 0) {
                return { topic: { id, number, title, moduleCode, unlocked: false } };
            } else {
                return {
                    error: "Unable to add topic."
                };
            }
        } else {
            return{
                error: "Cannot find that module."
            };
        }
    } else {
        return{
            error: "Topic number and title not supplied."
        };
    }
}

export function getTopics(moduleCode) {
    const topicDao = new TopicDao(db);
    const res = topicDao.getAllForModule(moduleCode);
    return res;
}

export function deleteTopic(id) {
    const controller = new Controller(db);
    return controller.deleteTopic(id);
}
