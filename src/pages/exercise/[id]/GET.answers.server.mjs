import db from '../../../db/db.mjs';
import AnswerDao from '../../../dao/answer.mjs';
import useLoggedIn from '../../../hooks/login.mjs';

export default async function GetAnswersForExercise(context) {
    const { isAdmin } = await useLoggedIn();
    if(!isAdmin) {
        return new Response(
            JSON.stringify({error: "Only admins can get exercise answers."}),
         { 
            status: 401,
            headers: { "Content-Type": "application/json" }
        });    
    }
    const match = context.url.pathname.match("/exercise/(\\d+)/answers/?$");
    if(match) {
        const answerDao = new AnswerDao(db);
        return new Response(
            JSON.stringify(answerDao.getAnswersForExercise(match[1])),
         { 
            headers: { "Content-Type": "application/json" }
        });    
    } else {
        return new Response(
            JSON.stringify({error: "Invalid format for exercise ID"}),
        { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });    
    }
}
