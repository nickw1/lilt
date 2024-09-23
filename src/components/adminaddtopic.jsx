import React, { useState } from 'react';

export default function AdminAddTopicComponent({onTopicAdded}) {

    return <div>
        <h3>Add Topic</h3>
        Topic number: <br />
        <input id='topicNumber' type='number' /><br />
        Topic title: <br />
        <input id='topicTitle' type='text' style={{width:"400px"}}/><br />
        <input type='button' value='Go!' onClick={addTopic} />
        </div>;

    async function addTopic() {
        try {
            const topic = {
                number: document.getElementById('topicNumber').value,
                title: document.getElementById('topicTitle').value
            };

            const response = await fetch('topic/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(topic)
            });
            const json = await response.json();
            if(response.status == 200) {
                alert(`ID in database: ${json.id}`);
                topic.id = json.id;
                onTopicAdded(topic);
            } else {
                alert(json.error);
            }
        } catch(e) {    
            alert(e);
        }
    }
}
