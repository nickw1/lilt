
export default class ModuleDao {

    constructor(db) {
        this.db = db;
    }

    addModule(code, name) {
        const stmt = this.db.prepare("INSERT INTO modules(code, name) VALUES (?,?)");
        const info = stmt.run(code, name);
        return info.lastInsertRowid;
    }

    getAll() {
        const stmt = this.db.prepare("SELECT * FROM modules ORDER BY code");
        return stmt.all();
    }

    getModuleByCode(code) {
        const stmt = this.db.prepare("SELECT * FROM modules WHERE code=?");
        return stmt.get(code);
    }

    getTopicsForModule(moduleId) {
        const stmt = this.db.prepare("SELECT * FROM topics WHERE moduleid=?");
        return stmt.all(moduleId);
    }

    deleteModule(moduleId) {
        const stmt = this.db.prepare("DELETE FROM modules WHERE id=?");
        return stmt.run(moduleId);
    }
}
        
