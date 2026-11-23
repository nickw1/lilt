"use server"

import { getRequest, getPendingResponseHeaders } from 'tinyrsc/server';
import db from '../db';
import UserDao from '../dao/user.mjs';
import type { LoginState, AdminLoginState, GatekeeperState, GatekeeperSession } from '../types/';
import { getSession } from '../misc/session';
import type { UidSession } from "../types";



export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
    const request = getRequest()!;
    const userDao = new UserDao(db);
    const usercodeStr = formData.get("usercode") as string | null;
    if (usercodeStr === null) {
        return { "error": "No user code supplied.", usercode: null };
    } else if (!usercodeStr.match("^\\d+$")) {
        return { "error": "User code should be a number.", usercode: null };
    } else {
        const usercode = parseInt(usercodeStr);
        if (getPendingResponseHeaders()) {
            const user = userDao.findUserByCode(usercode);
            if (user) {
                console.log(`Found a user with code ${usercode}`);
                const session = await getSession<UidSession>(request);
                if (userDao.setLoggedIn(user.id, true)) {
                    console.log(`Set user with id ${user.id} as logged in`);
                    session.uid = user.id;
                    await session.save();
                    return { usercode, error: null };
                } else {
                    return { usercode: null, error: "Failed to login user. It's likely the user code has expired." };
                }

            } else {
                console.log('cannot find that user');
                return { usercode: null, error: "Cannot find that user" };
            }
        } else {
            return { error: "Not done in an RSC environment", usercode: null };
        }
    }
}

export async function logout() {
    const userDao = new UserDao(db);
    const request = getRequest()!;
    const session = await getSession<UidSession>(request);
    let loggedout = false;

    if (session.admin && userDao.setAdminLoggedIn(session.admin, false)) {
        loggedout = true;
        delete session.admin;
        delete session.uid;
        session.destroy();
    } else if (userDao.setLoggedIn(session.uid, false)) {
        loggedout = true;
        delete session.uid;
        session.destroy();
    }
    return { loggedout, error: loggedout ? null : "Failed to log out user." };

}

export async function newUser() {
    const userDao = new UserDao(db);
    const usercode = userDao.addUser();
    return usercode > 0 ? { usercode } : { error: "Failed to create new user" };
}

export async function adminLogin(prevState: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
    const request = getRequest()!;
    const userDao = new UserDao(db);
    const username = formData.get("username") as string, pass = formData.get("pass");
    if (username && pass && username.match("^\\w+$")) {
        const user = await userDao.findAdmin(username, pass);
        if (user === null) {
            return { adminLoggedIn: false, error: "Cannot find admin user" };
        } else {
            const session = await getSession<UidSession>(request);
            session.admin = username.toString();
            session.uid = 0;
            await session.save();
            return { adminLoggedIn: true, error: null };
        }
    }
    return { adminLoggedIn: false, error: "Login credentials not provided or username in unexpected format" };
}

export async function gatekeeper(prevState: GatekeeperState | null, formData: FormData) : Promise<GatekeeperState> {
    const request = getRequest()!;
    const passcode = formData.get("passcode");
    if (passcode == process.env.GATEKEEPER) {
        const session = await getSession<GatekeeperSession>(request);
        session.gatekeeper = true;
        await session.save();
        return { success: true };
    } else {
        return { success: false, error: "Invalid gatekeeper passcode." };
    }
}