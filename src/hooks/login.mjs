import UserDao from '../dao/user.mjs';
import db from '../db/db.mjs';
import { getIronSession } from 'iron-session';
import { cookieName, password } from '../misc/session.mjs';
import Cookies from '../misc/cookies.mjs';

export default async function useLoggedIn() {
    const session = await getIronSession(new Cookies(), { 
        cookieName, password
    } );
    const userDao = new UserDao(db);
    if(session?.uid !== undefined) {
        const isLoggedIn = (session.admin && userDao.isAdminLoggedIn(session.admin)) || (session.uid && userDao.isLoggedIn(session.uid));
        
        return {
            uid: session.uid,
            usercode: session.admin ? 0 : userDao.findUserById(session.uid)?.usercode,
            isAdmin: session.admin ? true: false
        };    
    }
    return { usercode: null, uid: null, isAdmin: false };
}
