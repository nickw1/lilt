"use client"

import { useActionState } from 'react';
import { adminLogin, logout } from '../actions/user.mjs';
import { useClient } from '@lazarv/react-server/client';

export default function AdminLoginComponent({isAdmin}) {
    
    const { navigate } = useClient();
    const [ adminLoginState, adminLoginWithState ] = useActionState(adminLogin, null);

    return <div>
        { !isAdmin ? 
            <form action={adminLoginWithState}>
            Username: <br /> <input id='username' name='username' /> <br />
            Password: <br /> <input id='pass' name='pass' type='password' /> <br />
            <input type='submit' value='Login' />
            <br />{ adminLoginState?.error || "" }
            </form>
            :
            <>Logged in as admin user. 
            <form action={logout}>
            <input type='submit' value='Logout'  /></form>
            </>
        }
        </div>
}
