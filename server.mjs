import express from 'express';
import expressSession from 'express-session';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
dotenv.config();
import betterSqlite3Session from 'express-session-better-sqlite3';
import answerRouter from './server/routes/answer.mjs';
import userRouter from './server/routes/user.mjs';
import pageRouter from './server/routes/page.mjs';

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

app.get('/', (req, res) => {
    res.send('<h1>Welcome to nwnotes!</h1>');
});

const isadmin = true;

app.use(['/answer/authorise','/answer/exercise/:id(\\d+)'], (req, res, next) => {
    if(isadmin || req.method == 'GET') {
        next();
    } else {
        res.status(401).json({error: "Not authorised to perform this action."});
    }
});
   
app.use(['/answer/new'], (req, res, next) => {
    if(req.session.uid) {
        next();
    } else {
        res.status(401).json({error: "Need to be logged in to answer a question."});
    }
});
 
app.use('/answer', answerRouter);
app.use('/user', userRouter);
app.use('/page', pageRouter);

const exerciseDao = new ExerciseDao(db);

app.get('/topic/:id(\\d+)/exercises', (req, res) => {
    const exercises = exerciseDao.getExercisesForTopic(req.params.id);
    res.json(exercises);
});

app.get('/exercise/:id(\\d+)', (req, res) => {
    const exercise = exerciseDao.getFullExercise(req.params.id);
    res.json(exercise);
});
    

const PORT = 3000;

app.listen(PORT, () => { console.log(`App listening on port ${PORT}.`) });
