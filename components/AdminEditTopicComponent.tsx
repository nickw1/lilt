import { useActionState } from 'react';
import { Edit } from 'react-feather';
import { editTopic } from '../actions/topic.js';
import Flash from './Flash';
import type { EditTopicState, EditTopicProps } from '../types';

export default function AdminEditTopicComponent({ topic, editLink } : EditTopicProps ) {

    const [editTopicState, editTopicWithState] = useActionState<EditTopicState, FormData>(editTopic, topic);
    
    return(
        <>
        <form action={editTopicWithState} style={{ display: "inline" }}>
        <input name="id" type="hidden" defaultValue={editTopicState.id} />
        <input name="publicNumber" type="number" min={1} style={{ width: "32px" }} defaultValue={editTopicState.number} />
        <input name="title" defaultValue={editTopicState.title} />
        <button type="submit">Save</button>
        </form>
        { editLink ? <a href={editLink}>
            <Edit color='blue' />
            </a> : "" }
        { editTopicState.error ? <Flash style={{ backgroundColor : '#ffc0c0' }} msg={editTopicState.error} /> : ""}
        </>
    );
}
