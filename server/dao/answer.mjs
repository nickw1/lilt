
export default class AnswerDao {
    
    constructor(db) {
        this.db = db;
    }

    addAnswer(uid, qid, answer) {
        const stmt = this.db.prepare("INSERT INTO answers(uid, qid, answer, authorised) VALUES (?,?,?,?)");
        const info = stmt.run(uid, qid, answer, 0);
        return info;
    }

    findAnswer(id) {
        const stmt = this.db.prepare("SELECT * FROM answers WHERE id=?");
        const results = stmt.get(id);
        return results;
    }

    hasUserAnsweredQuestion(uid, qid) {
        const stmt = this.db.prepare("SELECT * FROM answers WHERE uid=? AND qid=?");
        const results = stmt.get(uid, qid);
        return results !== null;
    }

    hasUserCompletedExercise(eid) {
        const stmt = this.db.prepare("SELECT a.authorised FROM questions q INNER JOIN answers a ON q.id=a.qid WHERE q.eid=?");
        const results = stmt.get(eid);
        return results.filter ( result => result.authorised === 0 ).length == 0;
    }

    authoriseAnswer(id) {
        const stmt = this.db.prepare("UPDATE answers SET authorised=1 WHERE id=?");
        const info = stmt.run(id);
        return info.changes === 1;
    }

    deleteAnswer(id) {
        const stmt = this.db.prepare("DELETE FROM answers WHERE id=?");
        const info = stmt.run(id);
        return info.changes === 1;
    }

    getAnswersForQuestion(qid) {
        const stmt = this.db.prepare("SELECT * FROM answers WHERE qid=? AND authorised=0");
        const results = stmt.get(qid);
        return results;
    }

    getAnswersForExercise(eid) {
        const stmt = this.db.prepare("SELECT q.id as qid, a.uid, a.answer, a.authorised FROM questions q INNER JOIN answers a ON a.qid=q.id INNER JOIN exercises e ON q.eid=e.id WHERE e.id=? AND a.authorised=0 ORDER BY q.id");
        return stmt.all(eid);
    }
}
