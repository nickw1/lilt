"use server"

import UserDao from '../dao/user.mjs';
import db from '../db/db.mjs';


export async function newUser(prevState, formData) {
    const userDao = new UserDao(db);
    const usercode = userDao.addUser();
    return usercode > 0 ? { success: true, usercode } : { error: "Unable to create new user." };
}
