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

    editQuestion(id, question, options) {
		console.log(`edtiing question ${id} to`);
		console.log(JSON.stringify(question));
        if(options.length) {
            const stmt0 = this.db.prepare("DELETE FROM qoptions WHERE qid=?");
            stmt0.run(id);
            for(let option of options) {
                const stmt1 = this.db.prepare("INSERT INTO qoptions(qid, option) VALUES (?,?)");
                stmt1.run(id, xss(option));
            }
        }
        const stmt = this.db.prepare("UPDATE questions SET question=? WHERE id=?");
        const info = stmt.run(xss(question), id);
        return info.changes; 
    }

    deleteQuestion(id) {
        const stmt0 = this.db.prepare("DELETE FROM answers WHERE qid=?");
        stmt0.run(id);
        const stmt1 = this.db.prepare("DELETE FROM qoptions WHERE qid=?");
        stmt1.run(id);
        const stmt2 = this.db.prepare("DELETE FROM questions WHERE id=?");
        const info = stmt2.run(id);
        return info.changes; 
    }

    deleteQuestionsForExercise(eid) {
        const deleted = [];
        const stmt = this.db.prepare("SELECT * FROM questions WHERE eid=?");
        const rows = stmt.all(eid);
        for(const {id} of rows) {
            if(this.deleteQuestion(id) == 1) {
                deleted.push(id);
            }
        }
        return deleted;
    }
}
