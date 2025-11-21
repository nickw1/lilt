import express from 'express';
import { reactServer } from '@lazarv/react-server/dev';
import Database from 'better-sqlite3';
import expressSession from 'express-session';
import betterSqlite3Session from 'express-session-better-sqlite3';
import userRouter from './src/routes/user.mjs';
import exerciseRouter from './src/routes/exercise.mjs';
import moduleRouter from './src/routes/module.mjs';
import staticRouter from './src/routes/static.mjs';

const app = express();

const sessDb = new Database("session.db");
const Sqlite3Store = betterSqlite3Session(expressSession, sessDb);

app.use(express.json());

app.use(expressSession({
    store: new Sqlite3Store(), 
    secret: 'ReplaceWithRandomString', 
    resave: true, 
    saveUninitialized: false, 
    rolling: true, 
    unset: 'destroy', 
    proxy: true, 
    cookie: { 
        maxAge: 1200000,
        httpOnly: false
    }
}));


//const server = await reactServer({origin:"http://localhost:3002"});
const server = await reactServer();

app.use('/user', userRouter);
app.use('/exercise', exerciseRouter);
app.use('/module', moduleRouter);
app.use('/static', staticRouter);

app.use('/', async(req, res, next) => {
    const { middlewares } = await server;
    middlewares(req, res, next);
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`);
});

