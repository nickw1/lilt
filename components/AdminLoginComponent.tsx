"use client"

import { useActionState } from 'react';
import { adminLogin } from '../actions/user';
import type { AdminLoginState } from '../types';
import { useConditionalRefresh } from '../hooks/client';

export default function AdminLoginComponent() {

    const [adminLoginState, adminLoginWithState] = useActionState<AdminLoginState, FormData>(adminLogin, { adminLoggedIn: false, error: null });

    useConditionalRefresh(adminLoginState.adminLoggedIn);

    return (
        <form action={adminLoginWithState}>
            Username: <br /> <input id='username' name='username' /> <br />
            Password: <br /> <input id='pass' name='pass' type='password' /> <br />
            <input type='submit' value='Login' />
            <br />{adminLoginState?.error || ""}
        </form>
    );
}