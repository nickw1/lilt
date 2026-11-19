"use client"

import { useRef, useState, useEffect, type ReactNode, type CSSProperties } from 'react';

export default function Flash({ msg, time, style }: { msg: string | ReactNode, time?: number, style?: CSSProperties }) {
    const timer = useRef<number>(null);
    const [message, setMessage] = useState<string | ReactNode>("");

    console.log(`Flash: ${msg} ${time} `)
    useEffect(() => {
        if (msg !== "") {
            if (timer.current !== null) { window.clearTimeout(timer.current); timer.current = null; }

            timer.current = window.setTimeout(() => {
                console.log("Flash: clearing message");
                setMessage("");
                timer.current = null;
            }, time || 10000);
            setMessage(msg);
        }
    }, [msg, time]);

    return <div style={style}>{message}</div>;
}