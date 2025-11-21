"use client"
import { Fragment, startTransition } from 'react';
import { useClient } from '@lazarv/react-server/client';


export default function LoggedInComponent({usercode}) {
    const { navigate } = useClient();
    return <Fragment>Your user code: <strong>{usercode === 0 ? "admin": usercode}</strong>
        <input type='button' value='Logout' onClick={logout} />
        </Fragment>;

     async function logout() {
        try {
            const response = await fetch('/user/logout', {
                method: 'POST'
            });
            const json = await response.json();
            if(response.status == 200) {
                startTransition(async() => navigate("/"));
            } else {
                alert("Logout error - this probably shouldn't happen!");
            }
        } catch(e) {
            alert(e);
        }
    }
}
