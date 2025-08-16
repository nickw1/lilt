"use client"

import  { useState, useContext, useEffect } from 'react';
import AdminAddTopicComponent from './AdminAddTopicComponent.jsx';
import { makePublic } from '../actions/topic.mjs';
import ModulesContext from '../context/module.mjs';

export default function AdminTopicComponent() {
	const moduleInfo = useContext(ModulesContext);

    const [topicsState, setTopicsState] = useState(moduleInfo.topics);
    const [status, setStatus] = useState("");

	useEffect(() => {
		setTopicsState(moduleInfo.topics);
	}, [moduleInfo]);

    const tops = topicsState
        .map((topic) => <li key={topic.id}>
            {topic.number} : {topic.title} ({moduleInfo.moduleCode})
            {topic.unlocked ? "" : 
                <button onClick={async() => {
                    const result = await makePublic(topic.id);
                    if(result.error) {
                        setState(result.error);
                    } else {
                        const newState = structuredClone(topicsState);
                        newState.find(topic2 => topic2.id == topic.id).unlocked = true;
                        setTopicsState(newState);
                    }    
                }}>Make Public</button>
            }</li>)

    return <div>
        <h2>Topics</h2>
        <ul>{tops.length > 0 ? tops: "No topics."}</ul>
        {status}
        <AdminAddTopicComponent moduleCode={moduleInfo.moduleCode} onTopicAdded={ topic => {
        const newState = structuredClone(topicsState);
        newState.push(topic);
        setTopicsState(newState);
}}  />
        </div>;
}
