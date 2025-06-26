"use client"

import React, { useState, useEffect, startTransition } from 'react';
import { useClient } from '@lazarv/react-server/client';

export default function AdminLoginComponent({isAdmin}) {

    const { navigate } = useClient();
 
    return <div>
        <form>
        { !isAdmin ? 
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
            const response = await fetch('/user/admin/login', {
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
                startTransition(async() => navigate('/admin'));
                document.getElementById('adminLoginError').innerHTML = '';
            } else {
                document.getElementById('adminLoginError').innerHTML = json.error;
            }
        } catch(e) {
            document.getElementById('adminLoginError').innerHTML = e; 
        }
    }

    async function logout() {
        try {
            const response = await fetch('/user/logout', {
                method: 'POST'
            });
            const json = await response.json();
            if(response.status == 200) {
                startTransition(async() => navigate('/admin'));
            } else {
                alert("Logout error - this probably shouldn't happen!");
            }
        } catch(e) {
            alert(e);
        }
    }
}
