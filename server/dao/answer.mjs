
export default class AnswerDao {
    
    constructor(db) {
        this.db = db;
    }

    addAnswer(uid, qid, answer) {
        if(!this.hasUserAnsweredQuestion(uid, qid)) {
            const stmt = this.db.prepare("INSERT INTO answers(uid, qid, answer, authorised,submitted) VALUES (?,?,?,?,?)");
            const info = stmt.run(uid, qid, answer, 0, Math.round(Date.now() / 1000));
            return info;
        } else {
            return null;
        }
    }

    findAnswer(id) {
        const stmt = this.db.prepare("SELECT * FROM answers WHERE id=?");
        const results = stmt.get(id);
        return results;
    }

    hasUserAnsweredQuestion(uid, qid) {
        const stmt = this.db.prepare("SELECT * FROM answers WHERE uid=? AND qid=?");
        const results = stmt.get(uid, qid);
        return results !== undefined;
    }

    hasUserCompletedExercise(uid, eid, allowUnauthorised=false) {
        const stmt = this.db.prepare(allowUnauthorised ?
            "SELECT a.authorised,q.id,q.eid FROM questions q INNER JOIN answers a ON q.id=a.qid WHERE q.eid=? AND a.uid=?" :
            "SELECT a.authorised,q.id,q.eid FROM questions q INNER JOIN answers a ON q.id=a.qid WHERE q.eid=? AND a.uid=? AND a.authorised=1"
        );
        const results = stmt.all(eid, uid);
        const stmt2 = this.db.prepare("SELECT COUNT(*) AS count FROM questions q WHERE q.eid=?");
        const results2 = stmt2.get(eid);
        return results.length == results2.count;
    }

    authoriseAnswer(id) {
        const stmt = this.db.prepare("UPDATE answers SET authorised=1, answer=NULL WHERE id=?");
        const info = stmt.run(id);
        return info.changes === 1;
    }

    authoriseQuestionAnswers(qid) {
        const stmt = this.db.prepare("UPDATE answers SET authorised=1, answer=NULL WHERE qid=?");
        const info = stmt.run(qid);
        return info.changes > 0;
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
        const stmt = this.db.prepare("SELECT a.id, q.id as qid, a.uid, a.answer, a.authorised FROM questions q INNER JOIN answers a ON a.qid=q.id INNER JOIN exercises e ON q.eid=e.id WHERE e.id=? AND a.authorised=0 ORDER BY q.id");
        return stmt.all(eid);
    }

    deleteOldAnswers() {
        const stmt = this.db.prepare("DELETE FROM answers WHERE ?-submitted > 604800");
        const info = stmt.run(Math.round(Date.now() / 1000));
        return info;
    }
}
