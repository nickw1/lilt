"use client"
import React, { useState, useEffect } from 'react';
import AdminAnswersListComponent from './AdminAnswersListComponent.jsx';

export default function AdminAnswersHolder({exid}) { 

    const [answers, setAnswers] = useState([]);

    // id, qid, uid, answer, authorised
    useEffect( () => {
        const timerHandle = setInterval(async() => {
            retrieveAnswers();
        },  5000);
        retrieveAnswers();
        return () => clearInterval(timerHandle);
    }, [exid]);

    async function retrieveAnswers() {
        const allAnswers = [];
        let ans = [];
        if(exid !== null) {
            const response = await fetch(`/exercise/${exid}/answers`);
            ans = await response.json(); 
        }
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
    }
    return <AdminAnswersListComponent answers={answers} />;
}
