"use server"

import { redirect } from '@lazarv/react-server';
import { getIronSession } from 'iron-session';
import { cookieName, password } from '../misc/session.mjs';
import Cookies from '../misc/cookies.mjs';
import UserDao from '../../server/dao/user.mjs';
import db from '../../server/db/db.mjs';

export async function login(usercode) {
    const userDao = new UserDao(db);
    if(usercode && usercode.match("^\\d+$")) {
        const user = userDao.findUserByCode(usercode);
        if(user) {
            const session = await getIronSession(new Cookies(), { 
                cookieName, password
            } );
            session.uid = user.id;
            await session.save();
            return { usercode };
        } else {
            return { error: "Cannot find that user code." };
        }
    } else {
        return { error: "User code missing or in an invalid format." };
    }
}

export async function logout() {
    const session = await getIronSession(new Cookies(), { 
        cookieName, password
    } );
    delete session.usercode;
    session.destroy();
    redirect('/');
}

export async function newUser(prevState, formData) {
    const userDao = new UserDao(db);
    const usercode = userDao.addUser();
    return usercode > 0 ? { success: true, usercode } : { error: "Unable to create new user." };
}

export async function adminLogin(username, pass) {
    const userDao = new UserDao(db);
    if(username && pass) {
        const user = await userDao.findAdmin(username, pass);
        if(user === null) {
            return { error: "Cannot find admin user" };
        } else {
            const session = await getIronSession(new Cookies(), { 
                cookieName, password
            } );
            session.admin = true; 
            session.uid = 0; // use 0 for admin user
            await session.save();
            return { loggedIn: true, admin: session.admin, uid: session.uid };
        } 
    } else {
        return { error: "User code missing or in an invalid format." };
    }
}
