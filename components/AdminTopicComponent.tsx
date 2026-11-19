"use client"

import { useState, useContext, useEffect } from 'react';
import AdminAddTopicComponent from './AdminAddTopicComponent';
import ConfirmDeleteComponent from './ConfirmDeleteComponent';
import AddExerciseComponent from './AddExerciseComponent';
import { makePublic, deleteTopic } from '../actions/topic.js';
import ModulesContext from '../context/module';
import EditNotesContext from '../context/editNotesEnabled';
import AdminEditTopicComponent from './AdminEditTopicComponent';
import Flash from './Flash';
import type { Topic } from '../types/index.js';


export default function AdminTopicComponent() {
    const moduleInfo = useContext(ModulesContext);
    const editNotesEnabled = useContext(EditNotesContext);

    const [topicsState, setTopicsState] = useState<Topic[]>(moduleInfo.topics!);
    const [status, setStatus] = useState<{message?: string, errors?: string[]}>({ message: "", errors: [] });

    useEffect(() => {
        setTopicsState(moduleInfo.topics!);
    }, [moduleInfo]);

    const tops = topicsState
        .map((topic) => <li key={topic.id} style={{ color: topic.visibility == 2 ? "lightgray" : "black" }}>
            <AdminEditTopicComponent topic={topic} editLink={editNotesEnabled ? `/admin/notes/write?module=${moduleInfo.code}&topicNum=${topic.number}` : null} />
            <ConfirmDeleteComponent color='red' onDeleteConfirmed={async () => {
                const deleteStatus = await deleteTopic(topic.id);
                if (deleteStatus.errors && deleteStatus.errors.length > 0) {
                    setStatus({ errors: deleteStatus.errors });
                } else {
                    const newTopicsState = topicsState.filter(t => t.id != topic.id);
                    setTopicsState(newTopicsState);
                }
            }} />
            <select defaultValue={topic.visibility} onChange={async (e) => {
                const result = await makePublic(topic.id, parseInt(e.target.value));
                if (result.error) {
                    setStatus({ errors: [result.error] });
                } else {
                    const newState = structuredClone(topicsState);
                    const foundTopic = newState.find((topic2: Topic) => topic2.id == topic.id);
                    if(foundTopic) {
                         foundTopic.visibility = parseInt(e.target.value)
                    }
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
        <ul>{tops.length > 0 ? tops : "No topics."}</ul>
        <Flash style={{ backgroundColor: status.errors ? '#ffc0c0' : '#c0ffc0' }} msg={status.errors ? <ul>{status.errors.map(error => <li>{error}</li>)}</ul> : status.message || ""} />
        <AdminAddTopicComponent moduleCode={moduleInfo.code!} onTopicAdded={(topic: Topic) => {
            const newState = structuredClone(topicsState);
            newState.push(topic);
            setTopicsState(newState);
        }} />
        <AddExerciseComponent topics={topicsState} />
    </div>;
}
