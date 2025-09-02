import Database from 'better-sqlite3';
import { loadEnvFile } from 'node:process';
loadEnvFile();
const db = new Database(process.env.NOTES_DB);
export default db;
