
import { useActionState } from 'react';
import { Edit } from 'react-feather';
import { Link } from '@lazarv/react-server/navigation';
import { editTopic } from '../actions/topic.mjs';

export default function AdminEditTopicComponent({ topic, editLink }) {

    const [editTopicState, editTopicWithState] = useActionState(editTopic, topic);
    
    return(
        <>
        <form action={editTopicWithState} style={{ display: "inline" }}>
        <input name="id" type="hidden" defaultValue={editTopicState.id} />
        <input name="publicNumber" type="number" min={1} style={{ width: "32px" }} defaultValue={editTopicState.number} />
        <input name="title" defaultValue={editTopicState.title} />
        <button type="submit">Save</button>
        </form>
        { editLink ? <Link to={editLink}>
            <Edit color='blue' />
            </Link> : "" }
        { editTopicState.error ? <span style={{ backgroundColor : '#ffc0c0' }}>{editTopicState.error}</span> : "" }
        </>
    );
}
