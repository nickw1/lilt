
import fs, { constants } from 'node:fs/promises';
import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import readlineSync from 'readline-sync';
import UserDao from '../src/dao/user.mjs';
import { loadEnvFile } from 'node:process';
import { dirname } from 'node:path';
import chalk from 'chalk';

const envFile = `${import.meta.dirname}/../.env`;
let dao;

async function menu() {
    loadEnvFile(envFile);
    const db = new Database(process.env.NOTES_DB);
    dao = new UserDao(db);
    let choice = -1;
    while(choice != 0) {
        console.log(chalk.bold.underline("Menu\n"));
        console.log("[1] Add an admin\n[0] Exit\n");
        choice = readlineSync.questionInt(">", {
            limitMessage: chalk.bold.red("Please enter a number.")
        });
        switch(choice) {
            case 1:
                await addAdmin();
                break;
            case 0:
                break;
            default:
                console.log(chalk.bold.red("Invalid option."));
                break;
        }
    }
}

async function addAdmin() {
    loadEnvFile(envFile);
    const username = readlineSync.question("Enter username:");
    const password = readlineSync.question("Enter password:", { hideEchoBack: true});
    const { lastInsertRowid } = await dao.addAdmin(username, password);
    console.log(lastInsertRowid ? 'Admin added.':'Error adding admin.');
}

async function setup(database, notes) {
    try {
        const db = new Database(database);
        const sql = [
            'DROP TABLE IF EXISTS modules',
            'DROP TABLE IF EXISTS admins', 
            'DROP TABLE IF EXISTS topics',
            'DROP TABLE IF EXISTS answers',
            'DROP TABLE IF EXISTS usercodes',
            'DROP TABLE IF EXISTS qoptions',
            'DROP TABLE IF EXISTS questions',
            'DROP TABLE IF EXISTS exercises',
            'CREATE TABLE exercises (id INTEGER PRIMARY KEY autoincrement, topic INTEGER, exercise text, moduleid INTEGER, publicNumber INTEGER)',
            'CREATE TABLE questions (id INTEGER PRIMARY KEY autoincrement, eid INTEGER, question TEXT, qtype TEXT, FOREIGN KEY (eid) REFERENCES exercises(id))',
            'CREATE TABLE qoptions(id INTEGER PRIMARY KEY autoincrement, qid INTEGER, option TEXT, FOREIGN KEY (qid) REFERENCES questions(id))',
            'CREATE TABLE usercodes (id INTEGER PRIMARY KEY autoincrement, usercode INTEGER, created REAL, loggedin INTEGER DEFAULT 0)',
            'CREATE TABLE answers (id INTEGER PRIMARY KEY autoincrement, uid INTEGER, qid INTEGER, answer TEXT, authorised INTEGER DEFAULT 0, submitted INTEGER, FOREIGN KEY (qid) REFERENCES questions(id), FOREIGN KEY (uid) REFERENCES usercodes(id))',
            'CREATE TABLE topics (id INTEGER primary key autoincrement, number INTEGER, title text, visibility INTEGER DEFAULT 0, moduleid INTEGER, updated INTEGER DEFAULT 0)',
            'CREATE TABLE admins(id INTEGER primary key autoincrement, username text, password text, loggedin INTEGER DEFAULT 0)',
            'CREATE TABLE modules (id INTEGER primary key autoincrement, code text, name text, visible INTEGER DEFAULT 1)',
        ];
        for(const statement of sql) {
            const stmt = db.prepare(statement);
            stmt.run();
        }
        try {
            await fs.access(notes);
            console.log(chalk.cyan(`${notes} already exists, not creating it.`));
        } catch(e1) {
            console.log(`Creating ${notes}.`);
            fs.mkdir(notes);
        }
        await fs.writeFile(envFile, `RESOURCES=${notes}\nNOTES_DB=${database}\n`);
        return { success: true };
    } catch(e) {
        return { error: e.message };
    }
}

async function init() {
    try {
        await fs.access(envFile);
        console.log(".env file setup - you can now add admins.");
        await menu();
    } catch(e) {
        console.log(chalk.bold.underline("Welcome to lilt.\n"));
        console.log(chalk.bold("The first thing you need to do is specify the notes directory (holding the\nnotes) and the database location. These will be written to a settings file\n'.env' inside the main lilt directory.\n"));
        const database = readlineSync.questionPath(chalk.yellow("Please enter the desired directory to hold the database (full path).\nThe database 'lilt.db' will be created here.\n"), { 
            limitMessage: chalk.bold.red("Please enter a valid directory path.")        });
        const notes = readlineSync.questionPath(chalk.yellow("Please enter the desired location for the notes directory (full path). The\ndirectory 'notes' will be created here.\n"), { 
            limitMessage: chalk.bold.red("Please enter a valid directory path.")
        });
        const status = await setup(
            `${database}/lilt.db`,
            `${notes}/notes`
        );
        console.log(status.error ?
            chalk.bold.red(status.error) : 
            chalk.bold.green("Setup complete - please run again to add an admin.")
        );
    }
}

await init();
