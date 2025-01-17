import { login, logout as actionLogout } from '../actions/user';
import Logout from './logout';
import { useActionState } from 'react';


export default function Login() {

	//const [loginState, modLogin] = useActionState(login, { usercode: 0 });
	//const [logoutState, modLogout] = useActionState(logout, { loggedout: false });


    return <div>
        <h2>Login</h2>
        <form action={login}>
        Usercode: <br />
        <input name="usercode" /><br />
        <input type="submit" value="Go!" />
        </form>
        </div>;
}        
