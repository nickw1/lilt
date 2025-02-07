import React, { useState, useEffect } from 'react';

export default function AdminAnswersComponent({exId, exNum}) { 

    const [answers, setAnswers] = useState([]);

    // id, qid, uid, answer, authorised
    useEffect( () => {
        const timerHandle= setInterval( pollServer,  10000);
        pollServer();
        return () => clearInterval(timerHandle);
    }, [exId]);

    const output = answers.map( (answer,i) => {
            const answersForQuestion = answer.answers.map ( 
                indivAnswer =>     
                    <li key={indivAnswer.id}>{indivAnswer.answer}</li>
                );
            return <div style={{whiteSpace: 'pre-wrap'}}>
                <h4>Question ID {answer.qid}</h4>
                <ul>{answersForQuestion}</ul>
                {answersForQuestion.length > 0 ? <input type='button' data-id={answer.qid} value='Authorise All' onClick={authoriseAll} /> : ''}
            </div>;
    });

    return <div>
        <h2>Answers</h2>
        <h3>Answers for exercise {exNum}</h3>
        {output.length > 0 ? output: "No answers."}
        </div>;


    
    async function authorise(e) {
        const answerId = e.target.getAttribute('data-id');
        try {
            const response = await fetch(`/answer/${answerId}/authorise`, {
                method: 'POST'
            });
            if(response.status == 200) {
                const newAnswers = [];
                answers.forEach ( question => {
                    newAnswers.push({
                        qid: question.qid,
                        answers: question.answers.filter ( answer => answer.id != answerId )
                    });
                });
                setAnswers(newAnswers);
            }
        } catch(e) {
        }
    }

    async function authoriseAll(e) {
        const questionId = e.target.getAttribute('data-id');
        try {
            const response = await fetch(`/answer/question/${questionId}/authorise`, {
                method: 'POST'
            });
            if(response.status == 200) {
                const newAnswers = answers.filter( q => q.qid != questionId );
                setAnswers(newAnswers);
            }
        } catch(e) {
        }
    }
    
    function pollServer() {
            const allAnswers = [];
            fetch(`/answer/exercise/${exId}`)
                .then(response => response.json())
                .then(ans => {
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
                    setAnswers(allAnswers);
                });
    }
}
