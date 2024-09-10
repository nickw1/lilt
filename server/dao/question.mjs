
export default class QuestionDao {
    
    constructor(db) {
        this.db = db;
    }

    findQuestion(id) {
        const stmt = this.db.prepare("SELECT * FROM questions WHERE id=?");
        const results = stmt.get(id);
        return results;
    }
}
