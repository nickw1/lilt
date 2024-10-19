import React, { useState, useEffect } from 'react';

export default function AdminAnswersComponent() {

    const [answers, setAnswers] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [exerciseDetail, setExerciseDetail] = useState([1,1]);

    useEffect( () => {
        fetch('/exercise/all')
            .then(response => response.json())
            .then(json => {
                setExercises(json);
            })
    }, []);

    // id, qid, uid, answer, authorised
    useEffect( () => {
        const timerHandle= setInterval( pollServer,  3000);
        pollServer();
        return () => clearInterval(timerHandle);
    }, [exerciseDetail]);

    const output = answers.map( (answer,i) => {
            const answersForQuestion = answer.answers.map ( 
                indivAnswer =>     
                    <li key={indivAnswer.id}>{indivAnswer.answer}
                        <input type='button' data-id={indivAnswer.id} value='Authorise' onClick={authorise} />
                    </li>
                );
            return <div style={{whiteSpace: 'pre-wrap'}}>
                <h4>Question {i+1}</h4>
                <ul>{answersForQuestion}</ul>
            </div>;
    });

    return <div>
        <h2>Answers</h2>
        Choose an exercise:
        <select onChange={(e) => {
            setExerciseDetail(e.target.value.split(':'));
        }}>
        { exercises.map (exercise => <option key={exercise.id} value={`${exercise.id}:${exercise.publicNumber}`}>{exercise.moduleCode}: T{exercise.topicNumber}: Ex {exercise.publicNumber}</option>) }
        </select>
        <h3>Answers for exercise {exerciseDetail[1]}</h3>
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
    
    function pollServer() {
            const allAnswers = [];
            fetch(`/answer/exercise/${exerciseDetail[0]}`)
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
