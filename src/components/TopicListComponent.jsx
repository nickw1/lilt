
import { Link } from '@lazarv/react-server/navigation';
import useLoggedIn from '../hooks/login.mjs';

export default async function TopicListComponent({ module, topicsList }) {
    const { isAdmin } = await useLoggedIn();
    return <>
        <h1>Index for {module}</h1>
        <ul>
            {topicsList.map(t =>
                <li key={t.number}>
                    {t.visibility == 2 && !isAdmin ? <span>{t.number} : {t.title}</span>: <Link to={`/?topic=${t.number}&module=${module}`}>{t.number} : {t.title}</Link>}
                </li>)
            }
        </ul>
    </>;
}
