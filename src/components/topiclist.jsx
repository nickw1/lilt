
export default function TopicListComponent({module, topicsList}) {
    return <>
        <h1>Index for {module}</h1>
        <ul>
        {topicsList.map( t => 
            <li key={t.number}>
                <a href={`/?topic=${t.number}&module=${module}`}>{t.number} : {t.title}</a>
            </li>)
        }
        </ul>
        </>;
}
