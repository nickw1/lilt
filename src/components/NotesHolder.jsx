"use client"
import { useEffect, useRef } from 'react';
import { useClient } from '@lazarv/react-server/client';

export default function NotesHolder({topic, children}) {
    const { navigate } = useClient();
    const timerIdRef = useRef(null);

    useEffect(() => {
        let lastReceivedUpdateTime = 0;
        timerIdRef.current = setInterval(async() => {
            if(topic > 0) {
                const response = await fetch(`/topic/${topic}/updated`);
                const { updateTime } = await response.json();
                if(updateTime !== null && lastReceivedUpdateTime != updateTime && Date.now() - updateTime < 30000) {
                    lastReceivedUpdateTime = updateTime;
                    navigate();
                }
            }
        }, 10000);
        return () => clearInterval(timerIdRef.current);
    }, []);

    return <div className="notes">{children}</div>;
}
