import Database from 'better-sqlite3';

const db = new Database(process.env.NOTES_DB);
export default db;
