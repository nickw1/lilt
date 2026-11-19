import type { Topic, TopicNavProps } from '../types';
export default function TopicNavComponent({ moduleCode, topics, currentTopic }: TopicNavProps) {
    return <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{
        topics.map((t: Topic) =>
            <a key={t.number} style={{
                padding: '8px',
                border: '1px solid black',
                backgroundColor: t.number == currentTopic ? 'blue' : 'gray',
                color: 'white',
                margin: '4px'
            }}
                href={`/?topic=${t.number}&module=${moduleCode}`}>{t.number}</a>
        )
    }</div>;
}