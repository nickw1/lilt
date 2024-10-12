import ExerciseDao from '../dao/exercise.mjs';
import AnswerDao from '../dao/answer.mjs';
import TopicDao from '../dao/topic.mjs';
import ModuleDao from '../dao/module.mjs';
import db from '../db/db.mjs';
import { parse, HTMLElement } from 'node-html-parser';
import fs from 'fs/promises';

// INPUT : module and topic are codes, not primary key ids
export default class NotesController {

    constructor() {
        this.exerciseDao = new ExerciseDao(db);
        this.answerDao = new AnswerDao(db);
        this.topicDao = new TopicDao(db);
        this.moduleDao = new ModuleDao(db);
    }

    async loadNotes(req, res) {
    
        try {
            const uid = req.session?.uid || 0;
            const notesJson = { 
                header: "",
                main: [ ]
            };
            const content = await fs.readFile(`${process.env.RESOURCES}/${req.params.module}/${req.params.topic}/index.html`);
            const root = parse(content);

            const moduleObj = this.moduleDao.getModuleByCode(req.params.module);
            
            const body = root.querySelector("body");
            if(!body) throw new Error("ILLEGAL: no <body> detected. If there is a <body>, check that your HTML is well-formed.");
            
            const topicInfo = this.topicDao.getTopicByNumber(moduleObj.id, req.params.topic);            
            const { number, title } = topicInfo;
            const unlocked = topicInfo.unlocked || req.session?.admin;
            notesJson.header = `<h1>Topic ${number}</h1><h1>${title}</h1>`;

            const main = body.querySelector("main");
            if(!main) throw new Error("ILLEGAL: no <main> detected. If there is a <main>, check that your HTML is well-formed.");

            for(let div of main.getElementsByTagName('div')) {
                const classes = div.classList.value;
                if(classes.indexOf("content-public") >= 0) {
                    notesJson.main.push({    
                        "type": "public",
                        "content": div.innerHTML
                    });
                } else if (classes.indexOf("content-exercise") >= 0){
                    const publicNumber = div.getAttribute("data-id");
                    if(publicNumber) {
                        let exObj = this.exerciseDao.getExerciseByPublicNumber(topicInfo.id, publicNumber);
                        if(exObj) {
                            const eid = exObj.id;
                            let depends = div.getAttribute("data-depends");
                            const depends2 = depends === undefined ? null : JSON.parse(depends);
                            const childElements = div.childNodes.filter(childNode => childNode instanceof HTMLElement);
                            notesJson.main.push(
                                this.handleExercise(childElements, eid, depends2, uid, publicNumber, topicInfo.id, unlocked)
                            );
                        } else {
                            throw new Error(`Cannot find exercise with public number ${publicNumber} for topic ${req.params.topic} of module ${req.params.module}`);
                        }
                    } else {
                        throw new Error("ILLEGAL: Exercise without data-id attribute.");
                    }
                } else if (classes.indexOf("content-protected") >= 0) {
                    let depends = JSON.parse(div.getAttribute("data-depends"));
                    if(depends !== undefined) {
                        notesJson.main.push(
                            this.handleProtected(depends, uid, div.innerHTML, topicInfo.id, unlocked)
                        );
                    } else {
                        throw new Error("ILLEGAL: Protected content without data-depends attribute");
                    }
                }
            }
            res.json(notesJson);
        } catch(e) {
            if(e.code === 'ENOENT') {
                res.status(404).json({"error" : "Topic not found."});
            } else {    
                res.status(500).json({"error": e.toString()});
            }
        }
    }

    handleExercise(childElements, eid, depends, uid, publicNumber, topicId, unlocked) {
        const completed = this.answerDao.hasUserCompletedExercise(uid, eid, true);
        if(!uid && !unlocked) {
            return({
                "type": "exercise",
                publicNumber,
                "status": "notLoggedIn"
            });
        } else if(completed || unlocked || depends === null || this.checkDependencies(topicId, depends, uid)) {
            const exerciseContent = [];
            for(const curElement of childElements) {
                if(curElement.classList?.contains("questions")) {
                    const questions = this.exerciseDao.getFullExercise(eid);
                    exerciseContent.push({
                        "exercise" :questions
                    });
                } else {
                    exerciseContent.push(curElement.outerHTML);
                }            
            }
            return({
                "type": "exercise",
                "id": eid,
                publicNumber,
                "content": exerciseContent,
                "showInputs": !unlocked,
                completed
            });
        } else {
            return({
                "type": "exercise",
                "id" : eid,
                publicNumber,
                "status": "unmetDependencies",
                "dependencies": depends
            });
        }
    }

    handleProtected(depends, uid, content, topicId, unlocked) {
        return unlocked || this.checkDependencies(topicId, depends, uid) ?
            ({
                "type": "protected",
                "content": content,
                "dependencies": depends
            })  :
            ({
                "type": "protected",
                "status": "unmetDependencies",
                "dependencies": depends
            });
    }

    checkDependencies(topicId, depends, uid) {
        if(typeof(depends) == "number") {
            depends = [depends];
        }

        const dependsGlobalId = depends.map ( depend => {
            const exer = this.exerciseDao.getExerciseByPublicNumber(topicId, depend) ;
            return exer?.id || 0;
        });
        const unansweredDepends = dependsGlobalId.filter( eid => eid > 0 && !this.answerDao.hasUserCompletedExercise(uid, eid) );
        return unansweredDepends.length === 0;
    }
}
