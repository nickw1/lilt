"use client"

import { useState } from 'react';
import { addTopic } from '../actions/topic.mjs';

export default function AdminAddTopicComponent({moduleCode, onTopicAdded}) {

    const [status, setStatus] = useState("");

    return <div>
        <h3>Add Topic</h3>
        Topic number: <br />
        <input id='topicNumber2' name='topicNumber2' type='number' /><br />
        Topic title: <br />
        <input id='topicTitle' name='topicTitle' type='text' style={{width:"400px"}}/><br />
        <button onClick={async() => {
            const result = await addTopic(
                moduleCode,
                document.getElementById('topicNumber2').value,
                document.getElementById('topicTitle').value
            );
            if(result.topic) {
                setStatus("Added topic successfully.");
                onTopicAdded(result.topic);
            } else {
                setStatus(result.error);
            } 
        }}>Go!</button>
        Add topic status: {status}
        </div>;

}
