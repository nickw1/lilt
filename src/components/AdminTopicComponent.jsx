"use client"

import  { useState, useContext, useEffect } from 'react';
import AdminAddTopicComponent from './AdminAddTopicComponent.jsx';
import ConfirmDeleteComponent from './ConfirmDeleteComponent.jsx';
import AddExerciseComponent from './AddExerciseComponent.jsx';
import { makePublic, deleteTopic } from '../actions/topic.mjs';
import ModulesContext from '../context/module.mjs';
import { useClient } from '@lazarv/react-server/client';
import { Link } from '@lazarv/react-server/navigation';
import { Edit } from 'react-feather';

export default function AdminTopicComponent() {
    const moduleInfo = useContext(ModulesContext);

    const [topicsState, setTopicsState] = useState(moduleInfo.topics);
    const [status, setStatus] = useState({message : ""});

    const { navigate } = useClient();

    useEffect(() => {
        setTopicsState(moduleInfo.topics);
    }, [moduleInfo]);

    const tops = topicsState
        .map((topic) => <li key={topic.id} style={{color: topic.visibility == 2 ? "gray":"black"}}>
            {topic.number} : {topic.title} ({moduleInfo.moduleCode})
            <Link to={`/admin/notes/write?module=${moduleInfo.moduleCode}&topicNum=${topic.number}`}>
            <Edit color='blue' />
            </Link>
            <ConfirmDeleteComponent color='red' onDeleteConfirmed={async() => {
                const deleteStatus = await deleteTopic(topic.id);
                if(deleteStatus.errors && deleteStatus.errors.length > 0) {
                    setStatus({errors: deleteStatus.errors});        
                } else {
                    const newTopicsState = topicsState.filter( t => t.id != topic.id );
                    setTopicsState(newTopicsState);
                }
            }} />
            <select defaultValue={topic.visibility} onChange={async(e) => {
                const result = await makePublic(topic.id, e.target.value);
                if(result.error) {
                    setStatus({errors: [result.error]});
                } else {
                    const newState = structuredClone(topicsState);
                    newState.find(topic2 => topic2.id == topic.id).visibility = e.target.value;
                    setTopicsState(newState);
                }    
            }}>
            <option value='0'>Normal</option>
            <option value='1'>Public</option>
            <option value='2'>Hidden</option>
            </select>

            </li>)

    return <div>
        <h3>Topics</h3>
        <div><strong>Explanation of visibility levels:</strong>
        <ul>
        <li><em>Normal</em> - protected content requires exercise completion.</li>
        <li><em>Public</em> - all content visible to all users.</li>
        <li><em>Hidden</em> - topic visible to admin users only.</li>
        </ul>
        </div>
        <ul>{tops.length > 0 ? tops: "No topics."}</ul>
        <div style={{backgroundColor: status.errors ? '#ffc0c0': '#c0ffc0'}}>{status.errors ? <ul>{status.errors.map(error => <li>{error}</li>)}</ul> : status.message || ""}</div>
        <AdminAddTopicComponent moduleCode={moduleInfo.moduleCode} onTopicAdded={ topic => {
        const newState = structuredClone(topicsState);
        newState.push(topic);
        setTopicsState(newState);
}}  />
        <AddExerciseComponent topics={topicsState}/>
        </div>;
}
