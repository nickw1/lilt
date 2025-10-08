"use client"
import { useEffect, useRef } from 'react';
import { useClient } from '@lazarv/react-server/client';

export default function NotesHolder({children}) {
    const { navigate } = useClient();
    const timerIdRef = useRef(null);

    useEffect(() => {
        timerIdRef.current = setInterval(() => {
            navigate();
        }, 15000);
        return () => clearInterval(timerIdRef.current);
    }, []);

    return <div className="notes">{children}</div>;
}
