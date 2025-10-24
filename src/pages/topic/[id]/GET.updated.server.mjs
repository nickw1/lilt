import db from '../../../db/db.mjs';
import TopicDao from '../../../dao/topic.mjs';

export default async function GetUpdateTime(context) {
    const match = /\/topic\/(\d+)\/updated\/?$/.exec(context.url.pathname);
    if(match) {
        try {
            const dao = new TopicDao(db);
            const updateTime = dao.getLastUpdateTime(match[1]);
            return new Response(
                JSON.stringify({updateTime}), {
                    headers: {"Content-Type": "application/json" }
                }
            );
        } catch(e) {
            return new Response(`Internal error: code ${e.code}`, {
                status: 500
            });
        }
    } else {
        return new Response(
            JSON.stringify(
                {error: "Invalid ID, not a number"}
            ), {
                headers: {"Content-Type": "application/json" },
                status: 400
            }
        );
    }
}
