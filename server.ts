import express, { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { init } from 'tinyrsc';
import { createRequest, sendResponse } from '@remix-run/node-fetch-server';
import db from './db';
import getLoginStatus from './misc/login';
import { getSessionFromExpress } from './misc/session';
import TopicDao from './dao/topic.mjs';
import AnswerDao from './dao/answer.mjs';
import ExerciseDao from './dao/exercise.mjs';
import fs from 'node:fs/promises';
import mime from 'mime-types';

const PORT = 3000;

const app = express();
app.use(express.json());

app.use('/', async (req: ExpressRequest, res: ExpressResponse, next) => {
    const { uid } = await getLoginStatus(req, res);
    const session = await getSessionFromExpress(req, res);
    if (uid !== null) {
        await session.save();
    }
    next();
});

app.get(/assets\/.*$/, express.static('dist/client'));

app.get('/static/:filename', async (req: ExpressRequest, res: ExpressResponse) => {

    const match = /^([\w-]*\.(\w+))$/.exec(req.params.filename as string);
    if (match) {
        try {
            const content = await fs.readFile(`${process.env.RESOURCES}/static/${match[1]}`);
            res.set('Content-Type', mime.lookup(match[2]) || 'text/plain');
            res.send(content);
        } catch (e: any) {
            const notfound = e.code == "ENOENT";
            res.status(notfound ? 404 : 500).json({ "error": notfound ? "Could not find that resource" : `Internal error: ${e}` });
        }
    } else {
        res.status(400).json({ "error": "Invalid filename format" });
    }
});

app.get('/user/current', async (req, res) => {
    const { uid } = await getLoginStatus(req, res);
    res.json({ loggedIn: uid !== null ? true : false });
});

app.get('/module/:module/topic/:topic/updated', (req: ExpressRequest, res: ExpressResponse) => {
    const module = req.params.module as string, topic = req.params.topic as string;
    if (/^\w+$/.exec(module) && /^\d+$/.exec(topic)) {
        try {
            const dao = new TopicDao(db);
            const results = dao.getTopicByModuleCodeAndNumber(module, topic);
            if (results) {
                res.set('Cache-Control', 'no-store')
                res.json({ updateTime: results.updated });
            } else {
                res.status(404).json({ error: "Cannot find that module and topic" });
            }
        } catch (e: any) {
            res.status(500).json({ error: `Internal error: code ${e.code}` });
        }
    } else {
        res.status(400).json({ error: "Invalid ID, not a number" });
    }
});

app.get('/exercise/:id/answers', async (req: ExpressRequest, res: ExpressResponse) => {
    const { isAdmin } = await getLoginStatus(req, res);
    if (!isAdmin) {
        res.status(401).json({ error: "Only admins can get exercise answers." });
    }
    const match = /^\d+$/.exec(req.params.id as string);
    if (match) {
        const answerDao = new AnswerDao(db);
        res.set("Cache-Control", "no-store");
        res.json(answerDao.getAnswersForExercise(req.params.id));

    } else {
        return res.status(500).json({ error: "Invalid format for exercise ID" });
    }
});

app.get('/exercise/:id', (req: ExpressRequest, res: ExpressResponse) => {
    const match = /^\d+$/.exec(req.params.id as string);
    if (match) {
        const exerciseDao = new ExerciseDao(db);
        res.json(exerciseDao.getFullExercise(req.params.id));
    } else {
        res.status(500).json({ error: "Invalid format for exercise ID" });
    }
});

app.get('/module/:module/topics', (req: ExpressRequest, res: ExpressResponse) => {
    const match = /^\w+/.exec(req.params.module as string);
    if (match) {
        const topicDao = new TopicDao(db);
        const showHidden = req.query.showHidden ? true : false;
        const results = topicDao.getAllForModule(req.params.module, showHidden);
        res.json(results);
    } else {
        res.status(500).json({ "error": "Invalid module code format" });
    }
});

const { requestHandler } = await init(app);
if (requestHandler) {
    app.use('/', async (req: ExpressRequest, res: ExpressResponse) => {
        try {
            const request = createRequest(req, res, { host: process.env.HOST });

            const response = await requestHandler(request);
            return sendResponse(res, response);
        } catch (e: any) {
            console.error(`ERROR: ${e}`);
        }
    });
}

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`);
})