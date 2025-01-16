"use server"

import { getIronSession } from 'iron-session';
import UserDao from '../server/dao/user';
import db from '../server/db/db';
import { password, cookieName } from '../misc/session';


async function login(formData) {
	/*
	const dao = new UserDao(db);
	const body = Object.fromEntries(formData);
	const session = await getIronSession(await cookies(), {password,cookieName} );
	if(body.usercode && body.usercode.match("^\\d+$")) {
		const user = dao.findUserByCode(body.usercode);
		if(user) {
			session.uid = user.id;
            dao.setLoggedIn(user.id, true);
			await session.save();
			redirect("/user");
		} else {
			redirect("/user?error=invalidLogin");
		}
	}
	*/
}

async function logout(formData) {
	/*	
	const dao = new UserDao(db);
	const session = await getIronSession(await cookies(), { password, cookieName } );
	dao.setLoggedIn(session.uid, false);
	delete session.uid;
	session.destroy();
	redirect("/user");
	*/
}


function getUsercode(prevState, formData) {
	/*
	const dao = new UserDao(db);
	const userCode = dao.addUser();
	return { userCode };
	*/
}

function addUser() {
}
export { login, logout, getUsercode, addUser };
