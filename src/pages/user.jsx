
import Login from '../components/login.jsx';
import Logout from '../components/logout.jsx';
import GetUsercode from '../components/getusercode.jsx';
import { getIronSession } from 'iron-session';
import Cookies from '../misc/cookies.mjs';
import { cookieName, password } from '../misc/session.mjs';
import UserDao from '../server/dao/user.mjs';
import db from '../server/db/db.mjs';
import { useHttpContext } from '@lazarv/react-server';

export default async function User() {
    console.log("*********************Re-rendering User");
    const cookies = new Cookies();
    let session;
    try {
        session = await getIronSession(cookies, { password, cookieName });
        const userDao = new UserDao(db); 
		console.log(`Session.uid = ${session.uid}, loggedin=${userDao.isLoggedIn(session.uid)}`);
        return (session.uid && userDao.isLoggedIn(session.uid)) ?
            <><h1>Logged in with id {session.uid}</h1><Logout /></> :
            <>{session.uid}<Login /></>;
    } catch(e) {
        return <h1>Error: ${e.code}</h1>;    
    }
}
