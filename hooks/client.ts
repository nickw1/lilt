    
import { useEffect } from "react";
import { refresh } from "tinyrsc/client";
import { LogoutState } from "../types";

export function useConditionalRefresh(flag: boolean | number | null) {
    useEffect(() => {
        if(flag !== false && flag !== null) {
            refresh();
        }
    }, [flag]);
}

export function useLogoutRefresh(loggedoutState: LogoutState) {
     useEffect(() => {
        if(loggedoutState.error) {
            alert(`Could not logout: ${loggedoutState.error}. This is probably a bug.`); // unlikely to happen in practice
        } else if (loggedoutState.loggedout) {
            console.log("***** Logged out - triggering refresh");
            refresh();
        }
    }, [loggedoutState.loggedout, loggedoutState.error]);
}