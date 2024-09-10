
export default class UserDao {
    
    constructor(db) {
        this.db = db;
    }

    addUser() {
        let code = 0, attempts = 0;
        while(attempts < 10 && (code == 0 || this.findUserByCode(code))) {
            code = Math.round(100000 + Math.random() * 900000);
            attempts++;
        }
        if(attempts < 10) {
            const stmt = this.db.prepare("INSERT INTO usercodes(usercode, created) VALUES(?,?)");
            const info = stmt.run(code, Math.round(new Date().getTime() / 1000));
            return info.changes ? code : 0;
        } else {
            return 0;
        }
    }

    findUserById(id) {
        const stmt = this.db.prepare("SELECT * FROM usercodes WHERE id=?");
        const results = stmt.get(id);
        return results;
    }

    findUserByCode(code) {
        const stmt = this.db.prepare("SELECT * FROM usercodes WHERE usercode=?");
        const results = stmt.get(code);
        return results;
    }

    deleteUser(id) {
        const stmt = this.db.prepare("DELETE FROM answers WHERE uid=?");
        stmt.run(id);
        const stmt2 = this.db.prepare("DELETE FROM usercodes WHERE id=?");
        const info = stmt2.run(id);
        return info.changes;
    }
}
