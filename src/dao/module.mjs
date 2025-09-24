
export default class ModuleDao {

    constructor(db) {
        this.db = db;
    }

    addModule(code, name) {
        const stmt = this.db.prepare("INSERT INTO modules(code, name) VALUES (?,?)");
        const info = stmt.run(code, name);
        return info.lastInsertRowid;
    }

    getAll(showHidden = false) {
        const stmt = this.db.prepare(
            showHidden ? 
            "SELECT * FROM modules ORDER BY code" :
            "SELECT * FROM modules WHERE visible=1 ORDER BY code" 
        );
        return stmt.all();
    }

    getModuleByCode(code) {
        const stmt = this.db.prepare("SELECT * FROM modules WHERE code=?");
        return stmt.get(code);
    }

    getModuleById(id) {
        const stmt = this.db.prepare("SELECT * FROM modules WHERE id=?");
        return stmt.get(id);
    }

    getTopicsForModule(moduleId) {
        const stmt = this.db.prepare("SELECT * FROM topics WHERE moduleid=?");
        return stmt.all(moduleId);
    }

    setModuleVisibility(moduleId, isVisible) {
        const stmt = this.db.prepare("UPDATE modules SET visible=? WHERE id=?");
        const info = stmt.run(isVisible ? 1 : 0, moduleId);
        return info.changes > 0;
    }

    deleteModule(moduleId) {
        const stmt = this.db.prepare("DELETE FROM modules WHERE id=?");
        return stmt.run(moduleId);
    }
}
        
