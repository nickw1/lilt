import UserDao from '../../server/dao/user.mjs';
import db from '../../server/db/db.mjs';
import { getIronSession } from 'iron-session';
import { cookieName, password } from '../misc/session.mjs';
import Cookies from '../misc/cookies.mjs';

export default async function useLoggedIn() {
    const session = await getIronSession(new Cookies(), { 
        cookieName, password
    } );
    const userDao = new UserDao(db);
    if(session?.uid !== undefined && userDao.isLoggedIn(session.uid)){
        
        return {
            uid: session.uid,
            usercode: session.admin ? 0 : userDao.findUserById(session.uid)?.usercode,
            isAdmin: session.admin
        };    
    }
    return { usercode: null, uid: null, isAdmin: false };
}
