import React, { useState } from 'react';
import ModuleChooseComponent from './modulechoose.jsx';

export default function AdminAddTopicComponent({onTopicAdded}) {

    const [moduleCode, setModuleCode] = useState("");
    return <div>
        <h3>Add Topic</h3>
        <ModuleChooseComponent onModuleChosen={code=>{
            setModuleCode(code);
        } } /><br />
        Topic number: <br />
        <input id='topicNumber2' type='number' /><br />
        Topic title: <br />
        <input id='topicTitle' type='text' style={{width:"400px"}}/><br />
        <input type='button' value='Go!' onClick={addTopic} />
        </div>;

    async function addTopic() {
        if(moduleCode != "") {
            try {
                const topic = {
                    moduleCode,
                    number: document.getElementById('topicNumber2').value,
                    title: document.getElementById('topicTitle').value
                };
                const response = await fetch('/topic/new', {
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
        } else {
            alert('Please choose a module.');
        }
    }
}
