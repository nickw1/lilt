import ExerciseDao from '../dao/exercise.mjs';
import AnswerDao from '../dao/answer.mjs';
import TopicDao from '../dao/topic.mjs';
import db from '../db/db.mjs';
import { parse, HTMLElement } from 'node-html-parser';
import fs from 'fs/promises';

export default class NotesController {

    constructor() {
        this.exerciseDao = new ExerciseDao(db);
        this.answerDao = new AnswerDao(db);
        this.topicDao = new TopicDao(db);
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
            
            
            const body = root.querySelector("body");
            if(!body) throw new Error("ILLEGAL: no <body> detected. If there is a <body>, check that your HTML is well-formed.");
            
            const { number, title, unlocked } = this.topicDao.getTopicByNumber(req.params.topic);            
            notesJson.header = `<h1>Topic ${number}</h1><h1>${title}</h1>`;

            const main = body.querySelector("main");
            if(!main) throw new Error("ILLEGAL: no <main> detected. If there is a <main>, check that your HTML is well-formed.");

            for(let div of main.getElementsByTagName('div')) {
                const classes = div.classList.value;
                if(classes.indexOf("content-public") >= 0 || (classes.indexOf('content-protected') >= 0 && unlocked)) {
                    notesJson.main.push({    
                        "type": "public",
                        "content": div.innerHTML
                    });
                } else if (classes.indexOf("content-exercise") >= 0 && !unlocked) {
                    let eid = div.getAttribute("data-id");
                    if(eid !== undefined) {
                        let depends = div.getAttribute("data-depends");
                        const depends2 = depends === undefined ? null : JSON.parse(depends);
                        const childElements = div.childNodes.filter(childNode => childNode instanceof HTMLElement);
                        notesJson.main.push(
                            this.handleExercise(childElements, eid, depends2, uid)
                        );
                    } else {
                        throw new Error("ILLEGAL: Exercise without data-id attribute.");
                    }
                } else if (classes.indexOf("content-protected") >= 0) {
                    let depends = JSON.parse(div.getAttribute("data-depends"));
                    if(depends !== undefined) {
                        notesJson.main.push(
                            this.handleProtected(depends, uid, div.innerHTML)
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
                res.status(500).json({error: "Internal error - likely to be a bug in the code. Please add an issue on GitHub."});
            }
        }
    }

    handleExercise(childElements, eid, depends, uid) {
        if(this.answerDao.hasUserCompletedExercise(uid, eid, true)) {
            return({
                type: "exercise",
                "id": eid,
                completed: true,
            });
        }
        else if(depends === null || this.checkDependencies(depends, uid)) {
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
                "content": exerciseContent
            });
        } else {
            return({
                "type": "exercise",
                "id" : eid,
                "status": "unmetDependencies",
                "dependencies": depends
            });
        }
    }

    handleProtected(depends, uid, content) {
        return this.checkDependencies(depends, uid) ?
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

    checkDependencies(depends, uid) {
        if(typeof(depends) == "number") {
            depends = [depends];
        }
        const unansweredDepends = depends.filter( eid => !this.answerDao.hasUserCompletedExercise(uid, eid) );
        return unansweredDepends.length === 0;
    }
}
