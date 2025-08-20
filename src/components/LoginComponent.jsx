"use client"
import React, { useState, useActionState } from 'react';
import { useClient } from "@lazarv/react-server/client";
import { login, logout, newUser } from '../actions/user.mjs';

export default function LoginComponent({usercode}) {

    const [newUserState, newUserWithState] = useActionState(newUser, null);
    const [newUserStage, setNewUserStage] = useState(0);
    const [loginState, loginWithState] = useActionState(login, null);
     
    const { navigate } = useClient();

    return usercode === null ? 
         (newUserStage === 1 && newUserState === null ?  <form action={newUserWithState}>
        <p style={{fontSize: '75%'}}><strong>Privacy notice:</strong> Your answers to questions, and progress (which questions you have answered) will be stored on the lilt server and linked to your user code, which is valid for one week. After one week, this information will be deleted. <strong>No personally identifiable information, for example name or email address, will be stored at all. This is a completely anonymous tool; user codes are randomly generated.</strong></p>
        <input type='submit' value='Click to accept the above.' />
        </form>
        :
        <>
        <form action={loginWithState} key='formLogin'>
        <div id='newUserStatus' style={{fontSize: "60%", fontWeight: "bold"}}>{newUserState?.usercode ? `Your user code is ${newUserState.usercode} and is valid for one week, please login` : (newUserState?.error || "")}</div>
        User code: <input id='usercode' name='usercode' />
        <input type='submit' value='Login'  />
        <div id='loginError'>{loginState?.error || ""}</div>
        </form>
        <input type='button' value='Get New User Code' onClick={ () => setNewUserStage(1) } />
        </>)
        :
        <form action={logout} key='formLogout'>Your user code: <strong>{usercode==1 ? "admin": usercode}</strong>
        <input type='submit' value='Logout' />
        </form>
}
