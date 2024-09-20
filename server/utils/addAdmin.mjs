import bcrypt from 'bcrypt';
import readline from 'readline/promises';
import UserDao from '../dao/user.mjs';
import Database from 'better-sqlite3';


const rl = readline.createInterface(process.stdin, process.stdout);
const username = await rl.question("Enter username:");
const password = await rl.question("Enter password:");
const db = new Database('../../nwnotes.db');
const dao = new UserDao(db);
const { lastInsertRowid } = await dao.addAdmin(username, password);
console.log(lastInsertRowid ? 'Admin added.':'Error adding admin.');

process.exit(0);
