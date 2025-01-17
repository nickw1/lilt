"use server"

import { getIronSession } from 'iron-session';
import UserDao from '../server/dao/user';
import db from '../server/db/db';
import { password, cookieName } from '../misc/session';
import { redirect } from '@lazarv/react-server';
import Cookies from '../misc/cookies';


async function login(formData) {
	const dao = new UserDao(db);
	const body = Object.fromEntries(formData);
	const session = await getIronSession(new Cookies(), {password,cookieName} );
	if(body.usercode && body.usercode.match("^\\d+$")) {
		const user = dao.findUserByCode(body.usercode);
		if(user) {
			session.uid = user.id;
            dao.setLoggedIn(user.id, true);
			await session.save();
			console.log("Redirecting...");
			redirect("/user");
		} else {
            console.log("Invalid login, redirecting...");
			redirect("/user");
		}
	}
}

async function logout(formData) {
	const dao = new UserDao(db);
	const session = await getIronSession(new Cookies(), { password, cookieName } );
	dao.setLoggedIn(session.uid, false);
	delete session.uid;
	session.destroy();
	redirect("/user");
}


function newUser(prevState, formData) {
	console.log("newUser()");
	const dao = new UserDao(db);
	const userCode = dao.addUser();
	console.log(userCode);
	return userCode > 0 ? { userCode }: { error : "Could not get new user code"};
}

export { login, logout, newUser };
