"use client"

import { useState } from 'react';
import { addTopic } from '../actions/topic.js';
import Flash from './Flash';
import type { AddTopicProps } from '../types';

export default function AdminAddTopicComponent({ moduleCode, onTopicAdded }: AddTopicProps) {

    const [status, setStatus] = useState<{ message?: string, error?: string }>({ message: "" });


    return <div>
        <h4>Add Topic</h4>
        Topic number: <br />
        <input id='topicNumber2' name='topicNumber2' type='number' /><br />
        Topic title: <br />
        <input id='topicTitle' name='topicTitle' type='text' style={{ width: "400px" }} /><br />
        <button onClick={async () => {
            const result = await addTopic(
                moduleCode,
                parseInt((document.getElementById('topicNumber2') as HTMLInputElement).value),
                (document.getElementById('topicTitle') as HTMLInputElement).value
            );
            if (result.topic) {
                setStatus({ message: "Added topic successfully." });
                onTopicAdded(result.topic);
            } else {
                setStatus({ error: result.error });
            }
        }}>Go!</button>
        <Flash style={{ backgroundColor: status.error ? "#ffc0c0" : "#c0ffc0" }} msg={status.error || status.message || ""} />
    </div>;

}
