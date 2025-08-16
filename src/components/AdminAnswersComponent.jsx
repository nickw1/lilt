/*
import { getAnswers } from '../actions/answer.mjs';

export default function AdminAnswersComponent({exercise}) { 

    const answers = getAnswersFromServer(exercise.id);
    return <AdminAnswersListComponent answers={answers} />;

    function getAnswersFromServer(exId) {
        const ans = getAnswers(exId);
        let currentQuestionId = 0, currentQuestion = null;
        for(let answer of ans) {
            if(answer.qid != currentQuestionId) {
                if(currentQuestion != null) {
                    allAnswers.push(currentQuestion);
                }
                currentQuestion = {
                    qid: answer.qid,
                    answers: []
                };
                currentQuestionId = answer.qid;
            }
            currentQuestion.answers.push(answer);
        }
        if(currentQuestion != null) {
            allAnswers.push(currentQuestion);
        }
        return allAnswers;
    }
}
*/
