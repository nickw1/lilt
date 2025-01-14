"use client"
import { login } from '../actions/user';
import { logout } from '../actions/user.mjs';
import Logout from './logout';
import { useActionState } from 'react';


export default function Login() {

	const [loginState, modLogin] = useActionState(login, { usercode: 0 });
	const [logoutState, modLogout] = useActionState(logout, { loggedout: false });

	console.log(logoutState.loggedout);

    return loginState.usercode > 0 && logoutState.loggedout == false ?
		<>Loggedout: {logoutState.loggedout}<h2>Logged in as {loginState.usercode}</h2>
		<form action={modLogout}>
		<input type="submit" value="Logout!" />
		</form></>
		:
		<div>
		Loggedout: {logoutState.loggedout}
        <h2>Login</h2>
        <form action={modLogin}>
		{JSON.stringify(loginState)}
        Usercode: <br />
        <input name="usercode" /><br />
        <input type="submit" value="Go!" />
	
        </form>
        </div>;
}        
