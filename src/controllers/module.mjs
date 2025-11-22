import db from '../db/db.mjs';
import TopicDao from '../dao/topic.mjs';

export default class ModuleController {
    constructor(db) {
        this.db = db;
    }

    getModuleTopics(req, res) {
        const match = req.params.code.match("^\\w+$");
        if(match) {
            const topicDao = new TopicDao(this.db);
            const showHidden = req.query.showHidden ? true : false;
            const results = topicDao.getAllForModule(req.params.code, showHidden);
            res.json(results);
        
        } else {
            res.status(500).json({error: "Invalid module code format"});
        }
    }

    getUpdateTime(req, res) {
        const match = req.params.code.match("^\\w+$") && req.params.id.match("^\\d+$");
        if(match) {
            try {
                const dao = new TopicDao(this.db);
                const results = dao.getTopicByModuleCodeAndNumber(req.params.code, req.params.id);
                if(results) {
                    res.set({'Cache-Control' : 'no-store'})
                        .json({updateTime: results.updated});
                } else {
                    res.status(404).json({error: "Cannot find that module and topic"});
                }
            } catch(e) {
                res.status(500).json({error: `Internal error: code ${e.code}`});
            }
        } else {
            res.status(400).json({error: "Invalid format for module code and/or ID"});
        }
    }
}
