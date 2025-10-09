import useLoggedIn from '../hooks/login.mjs';
import { getIronSession } from 'iron-session';
import { cookieName, password } from '../misc/session.mjs'
import Cookies from '../misc/cookies.mjs';

export default async function SessionRefreshMiddleware() {
    const { uid } = await useLoggedIn();
    if(uid !== null) {
        // refresh the session
        const session = await getIronSession(new Cookies(), { 
            cookieName, password 
        } );
        await session.save();
    }
}
