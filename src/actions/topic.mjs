"use server"

import db from '../../server/db/db.mjs'
import TopicDao from '../../server/dao/topic.mjs';
import ModuleDao from '../../server/dao/module.mjs';
import xss from 'xss';

export function addOrModifyTopic(prevState, formData) {
    const topicDao = new TopicDao(db), moduleDao = new ModuleDao(db);
    const operation = formData.get("operation"), moduleCode = formData.get("moduleCode"), number = formData.get("topicNumber2"), title = formData.get("topicTitle");
    switch(operation) {
        case "addTopic":
            if(moduleCode && number && title && number.match("^\\d+$")) {
                const moduleInfo = moduleDao.getModuleByCode(xss(moduleCode));
                if(moduleInfo) {
                    const id = topicDao.addTopic(moduleInfo.id, xss(number), xss(title));
                    prevState.topics.push({id, number, title, moduleCode, unlocked: false});
                    return {
                        topics: prevState.topics,
                        error: ""
                    };
                } else {
                    return{
                        topics: prevState.topics,
                        error: "Cannot find that module."
                    };
                }
            } else {
                return{
                    topics: prevState.topics,
                    error: "Topic number and title not supplied."
                };
            }
            break;
        case "makePublic":
            const id = formData.get("id");
            if(id) {
                const info = topicDao.makePublic(id);
                if(info.changes > 0) {
                    prevState.topics.find ( topic => topic.id == id ).unlocked = true;
                    return {
                        topics: prevState.topics,
                        error: ""
                    };
                }
            }
            break;
    }
}
