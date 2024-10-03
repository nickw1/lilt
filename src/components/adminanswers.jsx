import React, { useState, useEffect } from 'react';

export default function AdminAnswersComponent() {

    const [answers, setAnswers] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [eid, setEid] = useState(1);

    useEffect( () => {
        fetch('/exercise/all')
            .then(response => response.json())
            .then(json => {
                setExercises(json);
            })
    }, []);

    // id, qid, uid, answer, authorised
    useEffect( () => {
        const timerHandle= setInterval( () => {
            const allAnswers = [];
            fetch(`/answer/exercise/${eid}`)
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
        }, 3000);
        return () => clearInterval(timerHandle);
    }, [eid]);

    const output = answers.map( answer => {
            const answersForQuestion = answer.answers.map ( 
                indivAnswer =>     
                    <li key={indivAnswer.id}>{indivAnswer.answer}
                        <input type='button' data-id={indivAnswer.id} value='Authorise' onClick={authorise} />
                    </li>
                );
            return <div>
                <h4>Question {answer.qid}</h4>
                <ul>{answersForQuestion}</ul>
            </div>;
    });

    return <div>
        <h2>Answers</h2>
        Choose an exercise:
        <select onChange={(e) => setEid(e.target.value)}>
        { exercises.map (exercise => <option key={exercise.id}>{exercise.id}</option>) }
        </select>
        <h3>Answers for exercise {eid}</h3>
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
}
