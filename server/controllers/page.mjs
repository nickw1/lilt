import ExerciseDao from '../dao/exercise.mjs';
import AnswerDao from '../dao/answer.mjs';
import db from '../db/db.mjs';
import { parse } from 'node-html-parser';
import fs from 'fs/promises';

export default class PageController {

    constructor() {
        this.exerciseDao = new ExerciseDao(db);
        this.answerDao = new AnswerDao(db);
    }

    async loadPage(req, res) {
    
        try {
            const uid = req.session?.uid || 0;
            const pageJson = { 
                header: "",
                main: [ ]
            };
            const content = await fs.readFile(`${process.env.RESOURCES}/${req.params.topic}/index.html`);
            const root = parse(content);
            
            
            const body = root.querySelector("body");
            if(!body) throw new Error("ILLEGAL: no <body> detected. If there is a <body>, check that your HTML is well-formed.");
            
            pageJson.header = body.querySelector("header")?.innerHTML;

            const main = body.querySelector("main");
            if(!main) throw new Error("ILLEGAL: no <main> detected. If there is a <main>, check that your HTML is well-formed.");
            
            for(let div of main.getElementsByTagName('div')) {
                const classes = div.classList.value;
                if(classes.indexOf("content-public") >= 0) {
                    pageJson.main.push({    
                        "type": "public",
                        "content": div.innerHTML
                    });
                } else if (classes.indexOf("content-exercise") >= 0) {
                    let eid = div.getAttribute("data-id");
                    if(eid !== undefined) {
                        let depends = div.getAttribute("data-depends");
                        const depends2 = depends === undefined ? null : JSON.parse(depends);
                        const childElements = div.getElementsByTagName("*");
                        pageJson.main.push(
                            this.handleExercise(childElements, eid, depends2, uid)
                        );
                    } else {
                        throw new Error("ILLEGAL: Exercise without data-id attribute.");
                    }
                } else if (classes.indexOf("content-protected") >= 0) {
                    let depends = JSON.parse(div.getAttribute("data-depends"));
                    if(depends !== undefined) {
                        pageJson.main.push(
                            this.handleProtected(depends, uid)
                        );
                    } else {
                        throw new Error("ILLEGAL: Protected content without data-depends attribute");
                    }
                }
            }
            res.json(pageJson);
        } catch(e) {
            if(e.code === 'ENOENT') {
                res.status(404).json({"error" : "Topic not found."});
            } else {    
                res.status(500).json({error: e});
            }
        }
    }

    handleExercise(childElements, eid, depends, uid) {
        if(depends === null || this.checkDependencies(depends, uid)) {
            const exerciseContent = [];
            for(const curElement of childElements) {
                if(curElement.classList?.contains("questions")) {
                    const questions = this.exerciseDao.getFullExercise(eid);
                    exerciseContent.push({
                        "questions" :questions
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

    handleProtected(depends, uid) {
        return this.checkDependencies(depends, uid) ?
            ({
                "type": "protected",
                "content": div.innerHTML
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
