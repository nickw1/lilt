import db from '../db/db.mjs'
import TopicDao from '../dao/topic.mjs';
import xss from 'xss';

export default class TopicController {

    constructor() {
        this.dao = new TopicDao(db);
    }

    addTopic(req, res) {
        try {
            if(req.body.number && req.body.title && req.body.number.match("^\\d+$")) {
                const id = this.dao.addTopic(xss(req.body.number), xss(req.body.title));
                res.json({id});
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
