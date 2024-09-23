import React, { useEffect, useState } from 'react';
import AdminAddTopicComponent from './adminaddtopic.jsx';

export default function AdminTopicComponent() {

    const [topics, setTopics] = useState({});

    useEffect(() => {
        fetch('topic/all')
            .then(response => response.json())
            .then(json => {
                const topicsMap = {};
                for(let topic of json) {
                    topicsMap[topic.id] = topic;
                }
                setTopics(topicsMap);
            }); 
    }, []);

    const tops = Object.keys(topics)
        .map(topicId => <li key={topicId}>{
            topics[topicId].number} : {topics[topicId].title} 
            {topics[topicId].unlocked ? "" : 
                <input type='button' value='Make Public' data-id={topicId} onClick={makePublic} />
            }</li>)

    return <div>
        <h2>Topics</h2>
        <ul>{tops.length > 0 ? tops: "No topics."}</ul>
        <AdminAddTopicComponent onTopicAdded={(topic)=> {
            const newTopics = structuredClone(topics);
            newTopics[topic.id] = topic;
            setTopics(newTopics);
        } } />
        </div>;


    async function makePublic(e) {
        const id = e.target.getAttribute('data-id');
        try {
            const response = await fetch(`topic/${id}/makePublic`, {
                method: 'POST'
            });
            if(response.status == 200) {
                const newTopics = structuredClone(topics);
                newTopics[id].unlocked = 1;
                setTopics(newTopics);
            }
        } catch(e) {
        }
    }
}
