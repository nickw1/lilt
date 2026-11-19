"use client"
import  { useState, useEffect } from 'react';
import AdminAnswersListComponent from './AdminAnswersListComponent';
import type { AnswersForQuestion, Answer } from '../types';

export default function AdminAnswersHolder({ exid }: { exid: number | null}) {

    const [answers, setAnswers] = useState<AnswersForQuestion[]>([]);

    // id, qid, uid, answer, authorised
    useEffect(() => {
        const timerHandle = setInterval(async () => {
            retrieveAnswers();
        }, 5000);
        retrieveAnswers();
        return () => clearInterval(timerHandle);
    }, [exid]);

    async function retrieveAnswers() {
        const allAnswers = [];
        let ans : Answer[] = [];
        if (exid !== null) {
            const response = await fetch(`/exercise/${exid}/answers`);
            ans = await response.json();
        }
        let currentQuestionId = 0, currentQuestion : AnswersForQuestion | null = null;
        for (let answer of ans) {
            if (answer.qid != currentQuestionId) {
                if (currentQuestion != null) {
                    allAnswers.push(currentQuestion);
                }
                currentQuestion = {
                    qid: answer.qid,
                    answers: []
                };
                currentQuestionId = answer.qid;
            }
            currentQuestion?.answers.push(answer);
        }
        if (currentQuestion != null) {
            allAnswers.push(currentQuestion);
        }
        setAnswers(allAnswers);
    }
    return <AdminAnswersListComponent answers={answers} />;
}
