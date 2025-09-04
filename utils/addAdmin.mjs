import bcrypt from 'bcrypt';
import readlineSync from 'readline-sync';
import UserDao from '../src/dao/user.mjs';
import Database from 'better-sqlite3';
import { loadEnvFile } from 'node:process';
import { dirname } from 'node:path';

loadEnvFile(`${import.meta.dirname}/../.env`);

const username = readlineSync.question("Enter username:");
const password = readlineSync.question("Enter password:", { hideEchoBack: true});
const db = new Database(process.env.NOTES_DB);
const dao = new UserDao(db);
const { lastInsertRowid } = await dao.addAdmin(username, password);
console.log(lastInsertRowid ? 'Admin added.':'Error adding admin.');

process.exit(0);
