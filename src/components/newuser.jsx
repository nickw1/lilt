"use client"

import { useActionState } from 'react';
import { newUser } from '../actions/user';

export default function NewUser() {

    const [stateNewUser, modNewUser] = useActionState(newUser, {userCode: 0});

    return <div>
        <h2>New User</h2>
		{ stateNewUser.error || stateNewUser.userCode } 
        <form action={modNewUser}>
        <input type="submit" value="Get User Code!" />
        </form>
        </div>;
}        
