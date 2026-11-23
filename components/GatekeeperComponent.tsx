"use client"

import { useActionState, useEffect } from 'react';
import { refresh } from 'tinyrsc/client';
import { gatekeeper } from '../actions/user';
import type { GatekeeperState } from '../types';


export default function GatekeeperComponent() {

    const [gatekeeperState, gatekeeperWithState] = useActionState<GatekeeperState | null, FormData>(gatekeeper, null);

    useEffect(() => {
        if(gatekeeperState?.success === true) {
            refresh();
        }
    }, [gatekeeperState]);

    return (<div>
        <form action={gatekeeperWithState}>
            <label htmlFor="passcode">Pass code:</label>
            <input name="passcode" id="passcode" type="password" />
            <button type="submit">Go!</button>
        </form>
        {gatekeeperState === null || gatekeeperState.success ? "" : <p style={{backgroundColor: '#ffc0c0'}}>{gatekeeperState.error}</p>}
    </div>
    );
}
