"use client"

import { useState, useActionState } from 'react';

import LoggedInComponent from './LoggedInComponent';
import type { LoginState, NullableUsercodeProps, Stylable } from '../types';
import { login, newUser } from '../actions/user';
import { useConditionalRefresh } from '../hooks/client';

export default function LoginComponent({ usercode } : NullableUsercodeProps & Stylable) {

    const [newUserState, newUserWithState] = useActionState(newUser, null);
    const [newUserStage, setNewUserStage] = useState(0);
    const [loginState, loginWithState] = useActionState<LoginState, FormData>(login, { usercode: null, error: null });

    useConditionalRefresh(loginState.usercode);

    return usercode === null ?
        (newUserStage === 1 && newUserState === null ? <form action={newUserWithState} onSubmit={() => setNewUserStage(2)}>
            <p style={{ fontSize: '75%' }}><strong>Privacy notice:</strong> Your answers to questions,
                and progress (which questions you have answered) will be stored on the lilt server and
                linked to your user code, which is valid for one week. After one week, this information
                will be deleted.
                <strong>No personally identifiable information, for example name or email address, will be
                    stored at all. This is a completely anonymous tool; user codes are randomly generated.</strong></p>
            <input type='submit' value='Click to accept the above.' />
        </form>
            :
            <>
                <form key='formLogin' action={loginWithState} onSubmit={() => {
                    setNewUserStage(0)
                }}>
                    <div id='newUserStatus' style={{ fontSize: "60%", fontWeight: "bold", backgroundColor: newUserState?.usercode ? '#c0ffc0' : '#ffc0c0' }}>
                        {newUserState?.usercode ? `Your user code is ${newUserState.usercode} and is valid for one 
                    week, please login` : (newUserState?.error || "")}</div>
                    User code: <input id='usercode' name='usercode' />  
                    <input type='submit' value='Login' />
                    <div id='loginError' style={{ backgroundColor: '#ffc0c0' }}>{newUserStage < 2 && loginState?.error ? loginState.error : ""}</div>
                </form>
                <input type='button' value='Get New User Code' onClick={() => setNewUserStage(1)} />
            </>)
        : <LoggedInComponent usercode={usercode} />
}
