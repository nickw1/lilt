"use client"

import React, { useEffect, useState, useActionState } from 'react';
import AdminAddTopicComponent from './AdminAddTopicComponent.jsx';
import { addOrModifyTopic } from '../actions/topic.mjs';

export default function AdminTopicComponent({topics}) {

	const [topicsState, actionAddOrModifyTopic] = useActionState(addOrModifyTopic, {
		topics,
		error: ""
	});

    const tops = topicsState.topics 
        .map(topic => <li key={topic.id}>
            {topic.number} : {topic.title} ({topic.moduleCode})
            {topic.unlocked ? "" : 
				<form action={actionAddOrModifyTopic}>
				<input type='hidden' name='id' value={topic.id} />
				<input type='hidden' name='operation' value='makePublic' />
                <input type='submit' value='Make Public' />
				</form>
            }</li>)

    return <div>
        <h2>Topics</h2>
        <ul>{tops.length > 0 ? tops: "No topics."}</ul>
        <AdminAddTopicComponent action={actionAddOrModifyTopic} />
        </div>;
}
