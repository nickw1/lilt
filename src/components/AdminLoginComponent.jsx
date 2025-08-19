"use client"

import { useState } from 'react';
import { adminLogin, logout } from '../actions/user.mjs';
import { useClient } from '@lazarv/react-server/client';

export default function AdminLoginComponent({isAdmin}) {
    
    const { navigate } = useClient();
    const [ adminLoginState, setAdminLoginState ] = useState("");

    return <div>
        { !isAdmin ? 
            <>
            { adminLoginState.error || "" }
            Username: <br /> <input id='username' name='username' /> <br />
            Password: <br /> <input id='password' name='password' type='password' /> <br />
            <button onClick={async() => {
                const result = await adminLogin(
                    document.getElementById('username').value, 
                    document.getElementById('password').value
                );
                if(result.loggedIn) {
                    alert('loggedin');
                    navigate('/admin');
                } else {
                    setAdminLoginState(result);
                }
            }}>Login</button></>
            :
            <>Logged in as admin user. 
            <form action={logout}>
            <input type='submit' value='Logout'  /></form>
            </>
        }
        <div id='adminLoginStatus'>{adminLoginState.error || (adminLoginState.loggedIn ? "Logged in successfully." : "")}</div>
        </div>
}
