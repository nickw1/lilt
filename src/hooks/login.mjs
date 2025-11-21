import UserDao from '../dao/user.mjs';
import db from '../db/db.mjs';
import { useHttpContext } from '@lazarv/react-server';

export default /*async*/ function useLoggedIn() {
 	const userDao = new UserDao(db);
    const {
        platform: { request: req }
    } = useHttpContext();
    if(req.session?.uid !== undefined){
        return {
            uid: req.session.uid,
            usercode: req.session.admin ? 0 : userDao.findUserById(req.session.uid)?.usercode,
            isAdmin: req.session.admin ? true: false
        };
    }
    return { usercode: null, uid: null, admin: false };
}
