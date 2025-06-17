import express from 'express';
import './server/misc/dotenv.mjs';
import { reactServer } from '@lazarv/react-server/dev';
import Database from 'better-sqlite3';
import expressSession from 'express-session';
import betterSqlite3Session from 'express-session-better-sqlite3';
import userRouter from './server/routes/user.mjs';

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
        maxAge: 600000,
        httpOnly: false
    }
}));


const server = await reactServer();

app.get('/api', (req, res) => {
    res.send("Welcome to the API!");
});

app.use('/user', userRouter);

app.use('/', async(req, res, next) => {
    const { middlewares } = await server;
    middlewares(req, res, next);
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`);
});
