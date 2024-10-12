import UserDao from '../dao/user.mjs';

export default class UserController {

    constructor(db) {
        this.userDao = new UserDao(db);
    }

    addUser(req, res) {
        const userCode = this.userDao.addUser();
        res.status(userCode > 0 ? 200:500).json({userCode});
    }

    login(req, res) {
        if(req.body.usercode && req.body.usercode.match("^\\d+$")) {    
            const user = this.userDao.findUserByCode(req.body.usercode);
            if(user) {
                req.session.uid = user.id;
                res.json({usercode: user.usercode});
            } else {
                res.status(401).json({error: "Cannot find user code"});
            }
        } else {
            res.status(400).json({error: "No user code provided."});
        }
    }

    logout(req, res) {
        req.session = null;
        res.json({loggedout: true});
    }

    checkLogin(req, res) {
        if(req.session?.admin) {
            res.json({usercode: req.session.uid});
        } else if(req.session?.uid) {
            const user = this.userDao.findUserById(req.session.uid);
            res.json({usercode: user.usercode}); 
        } else {
            res.json({usercode: null});
        }
    } 

    async adminLogin(req, res) {
        if(req.body.username && req.body.password) {
            const user = await this.userDao.findAdmin(req.body.username, req.body.password);
            if(user === null) {
                res.status(401).json({error: "Cannot find admin user"});
            } else {
                req.session.admin = true;
                req.session.uid = 1; // use 1 for admin user
                res.json({loggedIn: true});
            }
        } else {
            res.status(400).json({error: "No login details provided."});
        }
    }

    getAdminLogin(req, res) {
        res.json({loggedIn: req.session.admin ? true: false});
    }
}
