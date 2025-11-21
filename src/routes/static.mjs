import * as fs from 'fs';
import { loadEnvFile } from 'node:process';
import express from 'express';
import mime from 'mime-types';

const router = express.Router();
router.get('/:filename', async(req, res) => {
    loadEnvFile();
    const match = /^([\w-]*\.(\w+))$/.exec(req.params.filename);
    if(match) {
        try {
            const inStream = fs.createReadStream(`${process.env.RESOURCES}/static/${match[1]}`);
            res.set({'Content-Type': mime.lookup(match[2]) || "text/plain"});
            inStream.pipe(res);
        } catch(e) {
            const notfound = e.code == "ENOENT";
            res.status(notfound ? 404: 500).send(notfound ? "404 Not Found": `Internal error: code ${e.code}`);
        }
    } else {
        res.status(400).json({ error: "Invalid URL: resources must only contain letters, numbers, underscores and dashes." });
    }
});

export default router;
