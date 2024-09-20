import React, { useState, useEffect, Fragment } from 'react';

export default function LoginComponent({usercode, onLoggedIn, onLoggedOut}) {


    return usercode === null ?
        <Fragment>
        User code: <input id='usercode' />
        <input type='button' value='Login' onClick={login} />
        <br />
        <input type='button' value='Get New User Code' onClick={newUser} />
        <div id='loginError'></div>
        </Fragment>

        :

        <Fragment>Your user code: <strong>{usercode}</strong>
        <input type='button' value='Logout' onClick={logout} />
        </Fragment>;

    async function login() {
        try {
            const response = await fetch('/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    usercode : document.getElementById('usercode').value
                })
            });
            const json = await response.json();
            if(response.status == 200) {
                onLoggedIn(json.usercode);
            } else {
                document.getElementById('loginError').innerHTML = json.error;
            }
        } catch(e) {
            document.getElementById('loginError').innerHTML = e; 
        }
    }

    async function newUser() {
        try {
            const response = await fetch('/user/new', {
                method: 'POST',
            });
            const json = await response.json();
            if(response.status == 200) {
                alert(`Your user code: ${json.userCode}. This is valid for one week; please use it this week and then get a new one next week.`);
            } else {
                document.getElementById('loginError').innerHTML = json.error;
            }
        } catch(e) {
            document.getElementById('loginError').innerHTML = e; 
        }
    }

    async function logout() {
        try {
            const response = await fetch('/user/logout', {
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
