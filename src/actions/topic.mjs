"use server"

import db from '../db/db.mjs'
import TopicDao from '../dao/topic.mjs';
import ModuleDao from '../dao/module.mjs';
import Controller from '../controllers/controller.mjs';
import useLoggedIn from '../hooks/login.mjs';
import xss from 'xss';


export async function makePublic(id, state) {
    const { isAdmin } = await useLoggedIn();
    if(!isAdmin) {
        return {"error" : "Only admins can make a topic public."};
    }
    const topicDao = new TopicDao(db);
    if(id && id.toString().match("^\\d+$")) {
        const info = topicDao.makePublic(id, state);
        if(info.changes > 0) {
            topicDao.markUpdated(id);
            return { nUpdated: info.changes };
        }
        return { error: "Could not find topic with that ID." };
    } else {
        return { error: "No ID supplied." };
    }
}

export async function addTopic(moduleCode, number, title) {
    const { isAdmin } = await useLoggedIn();
    if(!isAdmin) {
        return {"error" : "Only admins can add a topic."};
    }
    const topicDao = new TopicDao(db), moduleDao = new ModuleDao(db);
    if(moduleCode && number && title && number.match("^\\d+$")) {
        const moduleInfo = moduleDao.getModuleByCode(xss(moduleCode));
        if(moduleInfo) {
            const id = topicDao.addTopic(moduleInfo.id, xss(number), xss(title));
            if(id > 0) {
                return { topic: { id, number, title, moduleCode, visibility: 0 } };
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

export async function deleteTopic(id) {
    const { isAdmin } = await useLoggedIn();
    if(!isAdmin) {
        return {"error" : "Only admins can delete a topic."};
    }
    const controller = new Controller(db);
    return controller.deleteTopic(id);
}
