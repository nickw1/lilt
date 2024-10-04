
export default function TopicNavComponent({module, topicsList, currentTopic}) {
    return <div style={{display: 'flex', justifyContent:'flex-end'}}>{
            topicsList.map(t => 
                <a key={t.number} style={{
                    padding: '8px', 
                    border: '1px solid black', 
                    backgroundColor: t.number==currentTopic  ? 'blue': 'gray', 
                    color: 'white', 
                    margin: '4px' }} 
                    href={`/?topic=${t.number}&module=${module}`}>{t.number}</a>
                )
            }</div>;
}
