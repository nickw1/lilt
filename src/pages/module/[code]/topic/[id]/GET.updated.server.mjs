import db from '../../../../../db/db.mjs';
import TopicDao from '../../../../../dao/topic.mjs';

export default async function GetUpdateTime(context) {
    const match = /\/module\/(\w+)\/topic\/(\d+)\/updated\/?$/.exec(context.url.pathname);
    if(match) {
        try {
            const dao = new TopicDao(db);
            const results = dao.getTopicByModuleCodeAndNumber(match[1], match[2]);
            if(results) {
                return new Response(
                    JSON.stringify({updateTime: results.updated}), {
                        headers: {"Content-Type": "application/json" }
                    }
                );
            } else {
                return new Response(
                    JSON.stringify({error: "Cannot find that module and topic"}), {
                        status: 404,
                        headers: {"Content-Type": "application/json" },

                });
            }
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
