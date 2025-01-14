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

    setLoggedIn(id, loginStatus) {
        console.log(`setLoggedIn ${id} ${loginStatus}`);
        const stmt = this.db.prepare("UPDATE usercodes SET loggedin=? WHERE id=?");
        const info = stmt.run(loginStatus ? 1:0, id);
		console.log(info.changes);
        return info.changes;
    }

    setAdminLoggedIn(username, loginStatus) {
        const stmt = this.db.prepare("UPDATE admins SET loggedin=? WHERE username=?");
        const info = stmt.run(usercode, loginStatus ? 1:0);
        return info.changes;
    }
    
    isLoggedIn(id) {
        const stmt = this.db.prepare("SELECT loggedin FROM usercodes WHERE id=?");
        const row = stmt.get(id);
        return row ? (row.loggedin ? true : false) : false;
    }

    isAdminLoggedIn(username) {
        const stmt = this.db.prepare("SELECT loggedin FROM admins WHERE usernamee=?");
        const row = stmt.get(username);
        return row ? (row.loggedin ? true : false) : false;
    }
    
    deleteOldUsercodes() {
        const stmt = this.db.prepare("DELETE FROM usercodes WHERE ?-created > 604800");
        const info = stmt.run(Date.now() / 1000);
        return info;
    }
}
