// Delete all answers and usercodes older than a week

import AnswerDao from '../dao/answer.mjs';
import UserDao from '../dao/user.mjs';
import Database from 'better-sqlite3';


const db = new Database('../../lilt.db');
const answerDao = new AnswerDao(db);
const userDao = new UserDao(db);

const userInfo = userDao.deleteOldUsercodes();

console.log(`${userInfo.changes} user codes deleted.`);
