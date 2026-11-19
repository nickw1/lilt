import UserDao from '../dao/user.mjs';
import db from '../db';
import { getSession, getSessionFromExpress } from './session';
import type { UidSession } from '../types';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

export default async function getLoginStatus(request: Request | ExpressRequest, response?: ExpressResponse): Promise<{ uid: number | null, usercode: number | null, isAdmin: boolean }> {
    const session = response ? await getSessionFromExpress<UidSession>(request as ExpressRequest, response) : await getSession<UidSession>(request as Request);
    const userDao = new UserDao(db);
    if (session?.uid !== undefined) {
        //const isLoggedIn = (session.admin && userDao.isAdminLoggedIn(session.admin)) || (session.uid && userDao.isLoggedIn(session.uid));

        return {
            uid: session.uid,
            usercode: session.admin ? 0 : userDao.findUserById(session.uid)?.usercode,
            isAdmin: session.admin ? true : false
        };
    }
    return { usercode: null, uid: null, isAdmin: false };
}
