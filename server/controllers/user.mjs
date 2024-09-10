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
        if(req.body.usercode) {    
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
        if(req.session?.uid) {
            const user = this.userDao.findUserById(req.session.uid);
            res.json({usercode: user.usercode}); 
        } else {
            res.json({usercode: null});
        }
    } 
}
