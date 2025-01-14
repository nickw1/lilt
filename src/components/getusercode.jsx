"use client"

import { useActionState } from 'react';
import { login, addUser } from '../actions/user';
//import { useClient } from '@lazarv/react-server/client';

export default function GetUsercode() {

    //const [stateLogin, modLogin] = useActionState(login, {usercode: 0});
    const [stateAddUser, modAddUser] = useActionState(addUser, {usercode: 0});

	//const { navigate } = useClient();

    return <div>
        <h2>Get Usercode</h2>
        <form action={modAddUser}>
        <input type="submit" value="Get User Code!" />
        {stateAddUser.error ? stateAddUser.error :stateAddUser.usercode}
        </form>
        </div>;
}        
