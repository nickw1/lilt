import xss from 'xss';

export default class QuestionDao {
    
    constructor(db) {
        this.db = db;
    }

    findQuestion(id) {
        const stmt = this.db.prepare("SELECT * FROM questions WHERE id=?");
        const results = stmt.get(id);
        return results;
    }

    addQuestions(eid, questions) {
        let qids = [];
        for(let q of questions) {
            qids.push(this.addQuestion(eid, q));
        }
        return qids;
    }

    addQuestion(eid, q) {
        const stmt = this.db.prepare("INSERT INTO questions(eid, question, qtype) VALUES (?,?,?)");
        const info = stmt.run(xss(eid), xss(q.question), q.options ? "options" : "text");
        const qid = info.lastInsertRowid;
        if(qid > 0 && q.options) {
            for (let option of q.options) {
                const stmt2 = this.db.prepare("INSERT INTO qoptions(qid, option) VALUES (?,?)");
                stmt2.run(qid, xss(option));
            }
        }
        return qid;
    }
}
