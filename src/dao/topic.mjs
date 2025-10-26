
export default class TopicDao {

    constructor(db) {
        this.db = db;
    }

    addTopic(moduleId, number, title) {
        const stmt = this.db.prepare("INSERT INTO topics(moduleid, number, title, visibility) VALUES (?,?,?,0)");
        const info = stmt.run(moduleId, number, title);
        return info.lastInsertRowid;
    }

    makePublic(topicId, state) {
        const stmt = this.db.prepare("UPDATE topics SET visibility=? WHERE id=?");
        const info = stmt.run(state, topicId);
        return info;
    }
   
    markUpdatedByAnswer(answerId) {
        const stmt = this.db.prepare("UPDATE topics SET updated=? WHERE id=(SELECT e.topic FROM exercises e INNER JOIN questions q ON q.eid=e.id INNER JOIN answers a ON a.qid=q.id WHERE a.id=?)");
        return stmt.run(new Date().getTime(), answerId);
    }

    markUpdatedByQuestion(questionId) {
        const stmt = this.db.prepare("UPDATE topics SET updated=? WHERE id=(SELECT e.topic FROM exercises e INNER JOIN questions q ON q.eid=e.id WHERE q.id=?)");
        return stmt.run(new Date().getTime(), questionId);
    }

    markUpdatedByExercise(exId) {
        const stmt = this.db.prepare("UPDATE topics SET updated=? WHERE id=(SELECT e.topic FROM exercises e WHERE e.id=?)");
        return stmt.run(new Date().getTime(), exId);
    }

    markUpdated(id) {
        const stmt = this.db.prepare("UPDATE topics SET updated=? WHERE id=?");
        return stmt.run(new Date().getTime(), id);
    }
         
    getLastUpdateTime(topicId) {
        const stmt = this.db.prepare("SELECT updated FROM topics WHERE id=?");
        const row = stmt.get(topicId);
        return row?.updated ?? null;
    }

    getAll() {
        const stmt = this.db.prepare("SELECT t.id,t.number,t.title,t.visibility,m.code AS moduleCode FROM topics t INNER JOIN modules m ON t.moduleid=m.id ORDER BY m.code, t.number");
        return stmt.all();
    }

    getAllForModule(moduleCode, showHidden = false) {
        const stmt = this.db.prepare(
            showHidden ?
            "SELECT t.* FROM topics t INNER JOIN modules m ON t.moduleid=m.id WHERE m.code=? ORDER BY m.code, t.number" :
            "SELECT t.* FROM topics t INNER JOIN modules m ON t.moduleid=m.id WHERE m.code=? AND t.visibility < 2 ORDER BY m.code, t.number"
        );
        return stmt.all(moduleCode);
    }

    getTopicByNumber(moduleId, topicNum) {
        const stmt = this.db.prepare("SELECT * FROM topics WHERE moduleid=? AND number=?");
        return stmt.get(moduleId, topicNum);
    }

    getTopicById(topicId) {
        const stmt = this.db.prepare("SELECT * FROM topics WHERE id=?");
        return stmt.get(topicId);
    }

    getTopicByModuleCodeAndNumber(moduleCode, topicNum) {
        const stmt = this.db.prepare("SELECT t.* FROM topics t INNER JOIN modules m ON t.moduleid=m.id WHERE m.code=? AND t.number=?");
        return stmt.get(moduleCode, topicNum);
    }

    deleteTopic(topicId) {
        const stmt = this.db.prepare("DELETE FROM topics WHERE id=?");
        return stmt.run(topicId);
    }
}
        
