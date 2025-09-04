// Delete all answers and usercodes older than a week

import AnswerDao from '../src/dao/answer.mjs';
import UserDao from '../src/dao/user.mjs';
import Database from 'better-sqlite3';
import loadEnvFile from 'node:process';

loadEnvFile(`${import.meta.dirname}/../.env`);
const db = new Database(process.env.NOTES_DB);
const answerDao = new AnswerDao(db);
const userDao = new UserDao(db);

const userInfo = userDao.deleteOldUsercodes();

console.log(`${userInfo.changes} user codes deleted.`);
