import db from '../db/db.mjs'
import ModuleDao from '../dao/module.mjs';
import xss from 'xss';

export default class ModuleController {

    constructor() {
        this.dao = new ModuleDao(db);
    }

    addModule(req, res) {
        try {
            if(req.body.code && req.body.name) {
                const id = this.dao.addModule(xss(req.body.code), xss(req.body.name));
                res.json({id});
            } else {
                res.status(400).json({error: "Module code and name not supplied."});
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
}
