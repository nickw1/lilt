import bcrypt from 'bcrypt';
import readlineSync from 'readline-sync';
import UserDao from '../dao/user.mjs';
import Database from 'better-sqlite3';


const username = readlineSync.question("Enter username:");
const password = readlineSync.question("Enter password:", { hideEchoBack: true});
const db = new Database('../../nwnotes.db');
const dao = new UserDao(db);
const { lastInsertRowid } = await dao.addAdmin(username, password);
console.log(lastInsertRowid ? 'Admin added.':'Error adding admin.');

process.exit(0);
