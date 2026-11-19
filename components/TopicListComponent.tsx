import { getRequest } from 'tinyrsc/server';
import getLoginStatus from '../misc/login';
import type { TopicListProps } from '../types';

export default async function TopicListComponent({ moduleCode, topics } : TopicListProps) {
    const request = getRequest()!;
    const { isAdmin } = await getLoginStatus(request);
    return <>
        <h1>Index for {moduleCode}</h1>
        <ul>
            {topics.map(t =>
                <li key={t.number}>
                    {t.visibility == 2 && !isAdmin ? <span>{t.number} : {t.title}</span>: <a href={`/?topic=${t.number}&module=${moduleCode}`}>{t.number} : {t.title}</a>}
                </li>)
            }
        </ul>
    </>
}