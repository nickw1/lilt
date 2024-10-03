import express from 'express';
import ViteExpress from 'vite-express';
import expressSession from 'express-session';
import Database from 'better-sqlite3';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import betterSqlite3Session from 'express-session-better-sqlite3';
import answerRouter from './server/routes/answer.mjs';
import userRouter from './server/routes/user.mjs';
import notesRouter from './server/routes/notes.mjs';
import exerciseRouter from './server/routes/exercise.mjs';
import topicRouter from './server/routes/topic.mjs';
import moduleRouter from './server/routes/module.mjs';

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
        '/module/new'
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

const exerciseDao = new ExerciseDao(db);

app.get('/topic/:id(\\d+)/exercises', (req, res) => {
    const exercises = exerciseDao.getExercisesForTopic(req.params.id);
    res.json(exercises);
});

app.get('/exercise/:id(\\d+)', (req, res) => {
    const exercise = exerciseDao.getFullExercise(req.params.id);
    res.json(exercise);
});

const PORT = 3002;

//app.listen(PORT, () => { console.log(`App listening on port ${PORT}.`) });
ViteExpress.listen(app, PORT, () => { console.log(`App listening on port ${PORT}.`) });
