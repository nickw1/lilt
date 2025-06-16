import express from 'express';
import ViteExpress from 'vite-express';
import expressSession from 'express-session';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import './server/misc/dotenv.mjs';
import betterSqlite3Session from 'express-session-better-sqlite3';
import answerRouter from './server/routes/answer.mjs';
import userRouter from './server/routes/user.mjs';
import notesRouter from './server/routes/notes.mjs';
import exerciseRouter from './server/routes/exercise.mjs';
import topicRouter from './server/routes/topic.mjs';
import moduleRouter from './server/routes/module.mjs';
import questionRouter from './server/routes/question.mjs';

import db from './server/db/db.mjs';

import ExerciseDao from './server/dao/exercise.mjs';

const app = express();
app.use(express.json());

const sessDb = new Database("session.db");

const SqliteStore = betterSqlite3Session(expressSession, sessDb);


app.use(expressSession({
    store: new SqliteStore(), 
    secret: 'ReplaceWithRandomString', 
    resave: true, 
    saveUninitialized: false, 
    rolling: true, 
    unset: 'destroy', 
    proxy: true, 
    cookie: { 
        maxAge: 600000, 
        httpOnly: false 
    }
}));

/*
app.get('/', (req, res) => {
    res.send('<h1>Welcome to nwnotes!</h1>');
});
*/

app.use([
        '/answer/:id(\\d+)/authorise',
        '/answer/exercise/:id(\\d+)',
        '/topic/new',
        '/topic/:id(\\d+)/makePublic',
        '/module/new',
        '/question/:id(\\d+)',
        '/exercise/:id(\\d+)'
    ], (req, res, next) => {
    if(req.session.admin || req.method == 'GET') {
        next();
    } else {
        res.status(401).json({error: "Not authorised to perform this action."});
    }
});
   
app.use(['/answer/new', '/answer/multiple'], (req, res, next) => {
    if(req.session.uid) {
        next();
    } else {
        res.status(401).json({error: "Need to be logged in to answer a question."});
    }
});
 
app.use('/answer', answerRouter);
app.use('/user', userRouter);
app.use('/notes', notesRouter);
app.use('/exercise', exerciseRouter);
app.use('/topic', topicRouter);
app.use('/module', moduleRouter);
app.use('/question', questionRouter);

const exerciseDao = new ExerciseDao(db);

app.get('/topic/:id(\\d+)/exercises', (req, res) => {
    const exercises = exerciseDao.getExercisesForTopic(req.params.id);
    res.json(exercises);
});

app.get('/exercise/:id(\\d+)', (req, res) => {
    const exercise = exerciseDao.getFullExercise(req.params.id);
    res.json(exercise);
});

app.get('/content/:filename([\\d\\w]+\\.[\\d\\w]+)', async(req, res) => {
    const stream =  fs.createReadStream(`${process.env.RESOURCES}/public/${req.params.filename}`);
    stream.on("error", e => {
        if(e.code === 'ENOENT') {
            res.status(404).json({error: "Cannot find specified content"});
        } else {
            res.status(500).json({error: e});
        }
    });
    stream.pipe(res);
});

app.use(express.static('dist'));
const PORT = 3002;

//app.listen(PORT, () => { console.log(`App listening on port ${PORT}.`) });
ViteExpress.listen(app, PORT, () => { console.log(`App listening on port ${PORT}.`) });
