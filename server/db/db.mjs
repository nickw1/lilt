import Database from 'better-sqlite3';

console.log('env:');
console.log(process.env.NOTES_DB);
const db = new Database(process.env.NOTES_DB);
export default db;
