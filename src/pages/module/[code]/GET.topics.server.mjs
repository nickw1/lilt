import db from '../../../db/db.mjs';
import TopicDao from '../../../dao/topic.mjs';

export default async function GetModuleTopics(context) {
    const match = context.url.pathname.match("/module/(\\w+)/topics/?$");
    if(match) {
        const topicDao = new TopicDao(db);
        const showHidden = context.url.searchParams.get("showHidden") ? true : false;
        const res = topicDao.getAllForModule(match[1], showHidden);
        return new Response(JSON.stringify(res), {
            headers: { "Content-Type" : "application/json" }
        });
    } else {
        return new Response(JSON.stringify({"error" : "Invalid module code format"}), {
            headers: { "Content-Type" : "application/json" },
            status: 500
        });
    }    
}
