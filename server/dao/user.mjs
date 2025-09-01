import bcrypt from 'bcrypt';

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
            const info = stmt.run(code, Math.round(Date.now() / 1000));
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

    setLoggedIn(id, status) {
        const stmt = this.db.prepare("UPDATE usercodes SET loggedin=? WHERE id=?");
        const info = stmt.run(status ? 1:0, id);
        return info.changes ? true : false;
    }

    isLoggedIn(id) {
        const stmt = this.db.prepare("SELECT loggedin FROM usercodes WHERE id=?");
        const results = stmt.get(id);
        if(results) {
            return results.loggedin ? true: false;
        }
        return false;
    }

    deleteUser(id) {
        const stmt = this.db.prepare("DELETE FROM answers WHERE uid=?");
        stmt.run(id);
        const stmt2 = this.db.prepare("DELETE FROM usercodes WHERE id=?");
        const info = stmt2.run(id);
        return info.changes;
    }

    async findAdmin(username, password) {
        const stmt = this.db.prepare("SELECT * FROM admins WHERE username=?");
        const result = stmt.get(username);
        if(result) {
            const match = await bcrypt.compare(password, result.password);
            return match ?  result.username : null;
        }
        return null;
    }

    async addAdmin(username, password) {
        const encPassword = await bcrypt.hash(password, 10);
        const stmt = this.db.prepare("INSERT INTO admins(username, password) VALUES(?, ?)");
        return stmt.run(username, encPassword);
    }

    deleteOldUsercodes() {
        const stmt = this.db.prepare("DELETE FROM usercodes WHERE ?-created > 604800");
        const info = stmt.run(Date.now() / 1000);
        return info;
    }
}
