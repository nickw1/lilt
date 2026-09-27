import useLoggedIn from '../hooks/login.mjs';
import { getIronSession } from 'iron-session';
import { cookieName, password } from '../misc/session.mjs'
import Cookies from '../misc/cookies.mjs';
import { usePathname } from '@lazarv/react-server';
import { loadEnvFile } from 'node:process';

// Not sure how you specify multiple middlewares (I tried creating a second *.middleware.mjs file), so have put 2 operations in one.

export default async function SessionRefreshMiddleware() {
    const pathname = usePathname();
    const { uid } = await useLoggedIn();
    const session = await getIronSession(new Cookies(), {
        cookieName, password
    });
    if (uid !== null) {
        // refresh the session

        await session.save();
    }
    if (pathname != "/") { // index already has a gatekeeper check

        loadEnvFile();
        if (process.env.GATEKEEPER && !session.gatekeeper) {

            return new Response("No access - attempt to circumvent gatekeeper", {
                status: 401
            })
        }

    }
}

