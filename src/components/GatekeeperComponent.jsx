"use client"
import { useActionState } from 'react';
import { gatekeeper } from '../actions/user.mjs';


export default function GatekeeperComponent() {

    const [gatekeeperState, gatekeeperWithState] = useActionState(gatekeeper, null);

    return (<div>
        <form action={gatekeeperWithState}>
            <label htmlFor="passcode">Pass code:</label>
            <input name="passcode" id="passcode" type="password" />
            <button type="submit">Go!</button>
        </form>
        {gatekeeperState === null ? "" : <p style={{backgroundColor: '#ffc0c0'}}>{gatekeeperState.error}</p>}
    </div>
    );
}
