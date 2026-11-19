"use server"

import { getRequest } from 'tinyrsc/server';
import db from '../db'
import TopicDao from '../dao/topic.mjs';
import ModuleDao from '../dao/module.mjs';
import Controller from '../controllers/controller';
import useLoggedIn from '../misc/login';
import xss from 'xss';
import type { EditTopicState, DeleteTopicReturn } from '../types';


export async function makePublic(id: number, state: number) {
    const request = getRequest()!;
    const { isAdmin } = await useLoggedIn(request);
    if (!isAdmin) {
        return { "error": "Only admins can make a topic public." };
    }
    const topicDao = new TopicDao(db);
    if (id && id.toString().match("^\\d+$")) {
        const info = topicDao.makePublic(id, state);
        if (info.changes > 0) {
            topicDao.markUpdated(id);
            return { nUpdated: info.changes };
        }
        return { error: "Could not find topic with that ID." };
    } else {
        return { error: "No ID supplied." };
    }
}

export async function addTopic(moduleCode: string, number: number, title: string) {
    const request = getRequest()!;
    const { isAdmin } = await useLoggedIn(request);
    if (!isAdmin) {
        return { "error": "Only admins can add a topic." };
    }
    const topicDao = new TopicDao(db), moduleDao = new ModuleDao(db);
    const numberString = number.toString();
    if (moduleCode && number && title && numberString.match("^\\d+$")) {
        const moduleInfo = moduleDao.getModuleByCode(xss(moduleCode));
        if (moduleInfo) {
            const id = topicDao.addTopic(moduleInfo.id, xss(numberString), xss(title));
            if (id > 0) {
                return { topic: { id, number, title, moduleCode, visibility: 0 } };
            } else {
                return {
                    error: "Unable to add topic."
                };
            }
        } else {
            return {
                error: "Cannot find that module."
            };
        }
    } else {
        return {
            error: "Topic number and title not supplied."
        };
    }
}

export async function deleteTopic(id: number) : Promise<DeleteTopicReturn> {
    const request = getRequest()!;
    const { isAdmin } = await useLoggedIn(request);
    if (!isAdmin) {
        return { "errors": ["Only admins can delete a topic."] };
    }
    const controller = new Controller(db);
    return controller.deleteTopic(id);
}

export async function editTopic(state: EditTopicState, formData: FormData): Promise<EditTopicState> {
    const id = formData.get("id") as string, publicNumber = formData.get("publicNumber") as string, title = formData.get("title") as string;
    console.log(`Details: ${id} ${publicNumber} ${title}`);
    const request = getRequest()!;
    const { isAdmin } = await useLoggedIn(request);
    if (!isAdmin) {
        return { "error": "Only admins can edit a topic.", ...state };
    }
    if (id && publicNumber && title && id.match("^\\d+$") && publicNumber.match("^\\d+$")) {
        const topicDao = new TopicDao(db);
        return topicDao.editTopic(id, publicNumber, xss(title)) ? { id: parseInt(id), number: parseInt(publicNumber), title } : state;
    } else {
        return {
            error: "ID, public number and title not supplied or in invalid format.",
            ...state
        };
    }
}
