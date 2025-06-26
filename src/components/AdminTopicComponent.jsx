"use client"

import React, { useEffect, useState } from 'react';
import AdminAddTopicComponent from './AdminAddTopicComponent.jsx';

export default function AdminTopicComponent() {

    const [topics, setTopics] = useState([]);

    useEffect(() => {
        fetch('/api/topic/all')
            .then(response => response.json())
            .then(json =>  setTopics(json)); 
    }, []);

    const tops = topics 
        .map(topic => <li key={topic.id}>
            {topic.number} : {topic.title} ({topic.moduleCode})
            {topic.unlocked ? "" : 
                <input type='button' value='Make Public' data-id={topic.id} onClick={makePublic} />
            }</li>)

    return <div>
        <h2>Topics</h2>
        <ul>{tops.length > 0 ? tops: "No topics."}</ul>
        <AdminAddTopicComponent onTopicAdded={(topic)=> {
            const newTopics = structuredClone(topics);
            newTopics.push(topic);
            setTopics(newTopics);
        } } />
        </div>;


    async function makePublic(e) {
        const id = e.target.getAttribute('data-id');
        try {
            const response = await fetch(`/api/topic/${id}/makePublic`, {
                method: 'POST'
            });
            if(response.status == 200) {
                const newTopics = structuredClone(topics);
                const t = newTopics.find(topic => topic.id == id);
                if(t) t.unlocked = 1;
                setTopics(newTopics);
            }
        } catch(e) {
            alert(e.toString());
        }
    }
}
