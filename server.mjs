import express from 'express';
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

// Change if you want to run on another port
const PORT = 3002;

const [reactServerModule, ...reactServerArgs] = 
    process.env.NODE_ENV !== "production" ?
    ["@lazarv/react-server/dev"] :
    ["@lazarv/react-server/node", { origin: `http://localhost:${PORT}`}];
const { reactServer } = await import(reactServerModule);
const server = await reactServer(...reactServerArgs);

app.use('/user', userRouter);
app.use('/exercise', exerciseRouter);
app.use('/module', moduleRouter);
app.use('/static', staticRouter);

// Front-end pings the server every minute when user is answering exercise,
// prevents session timeouts before user submits
app.get('/ping', (req, res) => {
    res.send("ok");
});

app.use('/', async(req, res, next) => {
    const { middlewares } = await server;
    middlewares(req, res, next);
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`);
});

