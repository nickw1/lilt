DROP TABLE IF EXISTS modules;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS usercodes;
DROP TABLE IF EXISTS qoptions; 
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS sqlite_sequence;
DROP TABLE IF EXISTS exercises;


CREATE TABLE exercises (id INTEGER PRIMARY KEY autoincrement, topic INTEGER, exercise text, moduleid integer, publicNumber integer);
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE questions (id INTEGER PRIMARY KEY autoincrement, eid INTEGER, question TEXT, qtype TEXT, FOREIGN KEY (eid) REFERENCES exercises(id));
CREATE TABLE qoptions(id INTEGER PRIMARY KEY autoincrement, qid INTEGER, option TEXT, FOREIGN KEY (qid) REFERENCES questions(id));
CREATE TABLE usercodes (id INTEGER PRIMARY KEY autoincrement, usercode INTEGER, created INTEGER);
CREATE TABLE answers (id INTEGER PRIMARY KEY autoincrement, uid INTEGER, qid INTEGER, answer TEXT, authorised INTEGER DEFAULT 0, submitted integer, FOREIGN KEY (qid) REFERENCES questions(id), FOREIGN KEY (uid) REFERENCES usercodes(id));
CREATE TABLE topics (id integer primary key autoincrement, number integer, title text, unlocked integer default 0, moduleid integer, updated integer default 0);
CREATE TABLE admins(id integer primary key autoincrement, username text, password text);
CREATE TABLE modules (id integer primary key autoincrement, code text, name text);
