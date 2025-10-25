import db from '../../db/db.mjs';
import ExerciseDao from '../../dao/exercise.mjs';
import useLoggedIn from '../../hooks/login.mjs';

export default async function GetFullExercise(context) {
    const match = context.url.pathname.match("/exercise/(\\d+)/?$");
    if(match) {
        const exerciseDao = new ExerciseDao(db);
        return new Response(
            JSON.stringify(exerciseDao.getFullExercise(match[1]))
        , { 
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
