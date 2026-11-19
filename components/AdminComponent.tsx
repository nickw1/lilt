"use client"

import { useActionState } from 'react';
import AdminLoginComponent from './AdminLoginComponent';
import AdminMainComponent from './AdminMainComponent';
import { useLogoutRefresh } from '../hooks/client';
import { logout } from '../actions/user';
import type { AdminProps, LogoutState } from '../types';

export default function AdminComponent({isAdmin, modules} : AdminProps) {

    const [logoutState, logoutWithState] = useActionState<LogoutState>(logout, { loggedout: false, error: null });

    useLogoutRefresh(logoutState);

    return <div>
        {!isAdmin ?
            <AdminLoginComponent />
            :
            <>Logged in as admin user.
                <form action={logoutWithState}>
                    <input type='submit' value='Logout' /></form>
           
            <AdminMainComponent modules={modules} editNotesEnabled="false" />
             </>
        }
    </div>
}
