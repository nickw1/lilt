"use client"
import { useEffect, useRef } from 'react';
import { NotesProps } from '../types';
import { refresh } from 'tinyrsc/client';


export default function NotesHolder({ module, initTopic, children }: NotesProps & { children: React.ReactNode }) {
    const timerIdRef = useRef<number | null>(null);

    useEffect(() => {
        let lastReceivedUpdateTime = 0;
        timerIdRef.current = window.setInterval(async () => {
            if (initTopic > 0) {
                const response = await fetch(`/module/${module}/topic/${initTopic}/updated`);
                const { updateTime } = await response.json();
                if (updateTime !== null && lastReceivedUpdateTime != updateTime && Date.now() - updateTime < 30000) {
                    lastReceivedUpdateTime = updateTime;
                    refresh();
                }
            }
        }, 10000);
        return () => window.clearInterval(timerIdRef.current!);
    }, []);

    return <div className="notes">{children}</div>;
}
