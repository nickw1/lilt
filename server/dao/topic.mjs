
export default class TopicDao {

    constructor(db) {
        this.db = db;
    }

    addTopic(moduleId, number, title) {
        const stmt = this.db.prepare("INSERT INTO topics(moduleid, number, title, unlocked) VALUES (?,?,?,0)");
        const info = stmt.run(moduleId, number, title);
        return info.lastInsertRowid;
    }

    makePublic(topicId) {
        const stmt = this.db.prepare("UPDATE topics SET unlocked=1 WHERE id=?");
        const info = stmt.run(topicId);
        return info;
    }
    
    getAll() {
        const stmt = this.db.prepare("SELECT * FROM topics ORDER BY number");
        return stmt.all();
    }

    getAllForModule(moduleCode) {
        const stmt = this.db.prepare("SELECT * FROM topics t INNER JOIN modules m ON t.moduleid=m.id WHERE m.code=? ORDER BY m.code, t.number");
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
}
        
