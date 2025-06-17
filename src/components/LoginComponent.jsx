"use client"
import React, { useState, useEffect, Fragment, startTransition } from 'react';
import { useClient } from "@lazarv/react-server/client";

export default function LoginComponent({usercode}) {

    const [newUserState, setNewUserState] = useState(0);
    const { navigate } = useClient();

    return usercode === null ? 
         (newUserState == 1 ?  <div>
        <p style={{fontSize: '75%'}}><strong>Privacy notice:</strong> Your answers to questions, and progress (which questions you have answered) will be stored on the lilt server and linked to your user code, which is valid for one week. After one week, this information will be deleted. <strong>No personally identifiable information, for example name or email address, will be stored at all. This is a completely anonymous tool; user codes are randomly generated.</strong></p>
        <input type='button' onClick={newUser} value='Click to accept the above.' />
        </div>
        :
        <Fragment>
        User code: <input id='usercode' />
        <input type='button' value='Login' onClick={login} />
        <br />
        <input type='button' value='Get New User Code' onClick={newUser} />
        <div id='loginError'></div>
        </Fragment>)
        :
        <Fragment>Your user code: <strong>{usercode==1 ? "admin": usercode}</strong>
        <input type='button' value='Logout' onClick={logout} />
        </Fragment>

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
                startTransition(async() => navigate("/"));
            } else {
                document.getElementById('loginError').innerHTML = json.error;
            }
        } catch(e) {
            document.getElementById('loginError').innerHTML = e; 
        }
    }

    async function newUser() {
        if(newUserState == 1) {
            try {
                const response = await fetch('/user/new', {
                    method: 'POST',
                });
                const json = await response.json();
                if(response.status == 200) {
                    alert(`Your user code: ${json.userCode}. This is valid for one week; please use it this week and then get a new one next week.`);
                    setNewUserState(0);
                } else {
                    document.getElementById('loginError').innerHTML = json.error;
                }
            } catch(e) {
                document.getElementById('loginError').innerHTML = e; 
            }
        } else {
            setNewUserState(1);
        }
    }

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
