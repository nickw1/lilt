import db from '../db/db.mjs'
import TopicDao from '../dao/topic.mjs';
import ModuleDao from '../dao/module.mjs';
import xss from 'xss';

export default class TopicController {

    constructor() {
        this.dao = new TopicDao(db);
        this.moduleDao = new ModuleDao(db);
    }

    addTopic(req, res) {
        try {
            if(req.body.moduleCode && req.body.number && req.body.title && req.body.number.match("^\\d+$")) {
                const moduleInfo = this.moduleDao.getModuleByCode(xss(req.body.moduleCode));
                if(moduleInfo) {
                    const id = this.dao.addTopic(moduleInfo.id, xss(req.body.number), xss(req.body.title));
                    res.json({id});    
                } else {
                    res.status(404).json({error: "Cannot find that module."});
                }
            } else {
                res.status(400).json({error: "Topic number and title not supplied."});
            }
        } catch(e) {
            res.status(500).json({error: "Internal server error"});
        }
    }

    makePublic(req, res) {
        try {
            if(req.params.id) {
                const info = this.dao.makePublic(req.params.id);
                res.json({nUpdated: info.changes});
            } else {
                res.status(400).json({error: "Topic ID not supplied."});
            }
        } catch(e) {
            res.status(500).json({error: "Internal server error"});
        }
    }

    getAll(req, res) {
        try {
            res.json(this.dao.getAll());
        } catch(e) {
            res.status(500).json({error: "Internal server error"});
        }
    }

    getAllForModule(req, res) {
        try {
            res.json(this.dao.getAllForModule(req.params.moduleCode));
        } catch(e) {
            res.status(500).json({error: "Internal server error"});
        }
    }
}
