"use client"

import { useActionState } from 'react';
import { logout } from '../actions/user';
import type { UsercodeProps, LogoutState } from '../types';
import { useLogoutRefresh } from '../hooks/client';

export default function LoggedInComponent({ usercode }: UsercodeProps) {
    const [loggedoutState, logoutWithState] = useActionState<LogoutState>(logout, { loggedout: false, error: null })
    useLogoutRefresh(loggedoutState);

    return <form action={logoutWithState} key='formLogout'>Your user code: <strong>{usercode === 0 ? "admin" : usercode}</strong>
        <input type='submit' value='Logout' />
    </form>
}
