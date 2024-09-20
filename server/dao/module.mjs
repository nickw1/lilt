
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
}
        
