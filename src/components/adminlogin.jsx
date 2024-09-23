import React, { useState, useEffect } from 'react';

export default function AdminLoginComponent({loggedIn, onLoggedIn, onLoggedOut}) {


    return <div>
        <form>
        { !loggedIn ? 
            <>Username: <br /> <input id='username' /> <br />
            Password: <br /> <input id='password' type='password' /> <br />
            <input type='button' value='Login' onClick={login} /></>
            :
            <>Logged in as admin user. 
            <a href='#' onClick={logout}>Logout</a>
            </>
        }
        </form>
        <div id='adminLoginError'></div>
        </div>

    async function login() {
        try {
            const response = await fetch('user/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    username: document.getElementById('username').value,
                    password: document.getElementById('password').value
                })
            });
            const json = await response.json();
            if(response.status == 200) {
                // possible question - how do we transmit login status to the rest of the app?
                onLoggedIn();
            } else {
                document.getElementById('adminLoginError').innerHTML = json.error;
            }
        } catch(e) {
            document.getElementById('adminLoginError').innerHTML = e; 
        }
    }

    async function logout() {
        try {
            const response = await fetch('user/logout', {
                method: 'POST'
            });
            const json = await response.json();
            if(response.status == 200) {
                onLoggedOut();
            } else {
                alert("Logout error - this probably shouldn't happen!");
            }
        } catch(e) {
            alert(e);
        }
    }
}
