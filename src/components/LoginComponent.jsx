"use client"
import React, { useState, useActionState } from 'react';
import { useClient } from "@lazarv/react-server/client";
import { login, logout, newUser } from '../actions/user.mjs';

export default function LoginComponent({usercode}) {

    const [newUserState, newUserWithState] = useActionState(newUser, null);
    const [newUserStage, setNewUserStage] = useState(0);
    const [loginError, setLoginError] = useState("");
     
    const { navigate } = useClient();

    return usercode === null ? 
         (newUserStage === 1 && newUserState === null ?  <form action={newUserWithState}>
        <p style={{fontSize: '75%'}}><strong>Privacy notice:</strong> Your answers to questions, and progress (which questions you have answered) will be stored on the lilt server and linked to your user code, which is valid for one week. After one week, this information will be deleted. <strong>No personally identifiable information, for example name or email address, will be stored at all. This is a completely anonymous tool; user codes are randomly generated.</strong></p>
        <input type='submit' value='Click to accept the above.' />
        </form>
        :
        <>
        <div>
        <div id='newUserStatus' style={{fontSize: "60%", fontWeight: "bold"}}>{newUserState?.usercode ? `Your user code is ${newUserState.usercode} and is valid for one week, please login` : (newUserState?.error || "")}</div>
        User code: <input id='usercode' name='usercode' />
        <input type='button' value='Login' onClick={ async() => {
            const loginResult = await login(
                document.getElementById('usercode').value
            );
            if(loginResult.error) {
                setLoginError(loginResult.error);
            } else {
                navigate('/');
            }
        }} />
        <div id='loginError'>{loginError}</div>
        </div>
        <input type='button' value='Get New User Code' onClick={ () => setNewUserStage(1) } />
        </>)
        :
        <form action={logout}>Your user code: <strong>{usercode==1 ? "admin": usercode}</strong>
        <input type='submit' value='Logout' />
        </form>
}
