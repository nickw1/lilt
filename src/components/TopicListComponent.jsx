
import { Link } from '@lazarv/react-server/navigation';

export default function TopicListComponent({module, topicsList}) {
    return <>
        <h1>Index for {module}</h1>
        <ul>
        {topicsList.map( t => 
            <li key={t.number}>
                <Link to={`/?topic=${t.number}&module=${module}`}>{t.number} : {t.title}</Link>
            </li>)
        }
        </ul>
        </>;
}
