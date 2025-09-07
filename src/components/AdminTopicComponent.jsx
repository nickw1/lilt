"use client"

import  { useState, useContext, useEffect } from 'react';
import AdminAddTopicComponent from './AdminAddTopicComponent.jsx';
import ConfirmDeleteComponent from './ConfirmDeleteComponent.jsx';
import { makePublic, deleteTopic } from '../actions/topic.mjs';
import ModulesContext from '../context/module.mjs';

export default function AdminTopicComponent() {
    const moduleInfo = useContext(ModulesContext);

    const [topicsState, setTopicsState] = useState(moduleInfo.topics);
    const [status, setStatus] = useState({message : ""});

    useEffect(() => {
        setTopicsState(moduleInfo.topics);
    }, [moduleInfo]);

    const tops = topicsState
        .map((topic) => <li key={topic.id}>
            {topic.number} : {topic.title} ({moduleInfo.moduleCode})
            {topic.unlocked ? <span style={{color: "green", fontWeight: "bold", marginLeft: "8px", marginRight: "8px"}}>Public</span> : 
                <button onClick={async() => {
                    const result = await makePublic(topic.id);
                    if(result.error) {
                        setStatus({errors: [result.error]});
                    } else {
                        const newState = structuredClone(topicsState);
                        newState.find(topic2 => topic2.id == topic.id).unlocked = true;
                        setTopicsState(newState);
                    }    
                }}>Make Public</button>
            }
            <ConfirmDeleteComponent color='red' onDeleteConfirmed={async() => {
                console.log('deleting topic...');
                const deleteStatus = await deleteTopic(topic.id);
                if(deleteStatus.errors && deleteStatus.errors.length > 0) {
                    setStatus({errors: deleteStatus.errors});        
                } else {
                    console.log(`filtering topics state: removing ${topic.id} (${topic.number})`);
                    const newTopicsState = topicsState.filter( t => t.id != topic.id );
                    setTopicsState(newTopicsState);
                }
            }} /></li>)

    return <div>
        <h2>Topics</h2>
        <ul>{tops.length > 0 ? tops: "No topics."}</ul>
        <div style={{backgroundColor: status.errors ? '#ffc0c0': '#c0ffc0'}}>{status.errors ? <ul>{status.errors.map(error => <li>{error}</li>)}</ul> : status.message || ""}</div>
        <AdminAddTopicComponent moduleCode={moduleInfo.moduleCode} onTopicAdded={ topic => {
        const newState = structuredClone(topicsState);
        newState.push(topic);
        setTopicsState(newState);
}}  />
        </div>;
}
