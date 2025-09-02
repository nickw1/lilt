"use server"

import { redirect } from '@lazarv/react-server';
import { getIronSession } from 'iron-session';
import { cookieName, password } from '../misc/session.mjs';
import Cookies from '../misc/cookies.mjs';
import UserDao from '../dao/user.mjs';
import db from '../db/db.mjs';

export async function login(prevState, formData) {
    const userDao = new UserDao(db);
    const usercode = formData.get("usercode");
    if(usercode && usercode.match("^\\d+$")) {
        const user = userDao.findUserByCode(usercode);
        if(user) {
            const session = await getIronSession(new Cookies(), { 
                cookieName, password
            } );
            if(userDao.setLoggedIn(user.id, true)) {
                session.uid = user.id;
                await session.save();
                redirect('/');
            } else {
                return { error: "Failed to log in user." };
            }
        } else {
            return { error: "Cannot find that user code." };
        }
    } else {
        return { error: "User code missing or in an invalid format." };
    }
}

export async function logout() {
    const userDao = new UserDao(db);
    const session = await getIronSession(new Cookies(), { 
        cookieName, password
    } );
    let success = false;
    if(session.admin) {
        if(userDao.setAdminLoggedIn(session.admin, false)) {
            success = true;
            delete session.admin;
            delete session.uid;
            session.destroy();
            redirect('/');
        }
    } else {
        success = true;
        if(userDao.setLoggedIn(session.uid, false)) {
            delete session.uid;
            session.destroy();
            redirect('/');
        }
    }
    if(!success) {
        return { error: "Failed to log out user." };
    }
}

export async function newUser(prevState, formData) {
    const userDao = new UserDao(db);
    const usercode = userDao.addUser();
    return usercode > 0 ? { success: true, usercode } : { error: "Unable to create new user." };
}

export async function adminLogin(prevState, formData) {
    const userDao = new UserDao(db);
    const username = formData.get("username"), pass = formData.get("pass");
    if(username && pass) {
        const user = await userDao.findAdmin(username, pass);
        if(user === null) {
            return { error: "Cannot find admin user" };
        } else {
            const session = await getIronSession(new Cookies(), { 
                cookieName, password
            } );
            session.admin = username; 
            session.uid = 0; // use 0 for admin user
            await session.save();
            redirect('/admin'); 
        } 
    } else {
        return { error: "Login details missing or in an invalid format." };
    }
}
