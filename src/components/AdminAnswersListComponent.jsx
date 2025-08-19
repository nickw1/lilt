"use client"
import React, { useState, useEffect, useActionState } from 'react';
import { authoriseQuestionAnswers }  from '../actions/answer.mjs';

export default function AdminAnswersListComponent({answers}) { 

    const [status, setStatus] = useState("");
    const [authorisedQuestions, authoriseAnswersWithState] = useActionState(authoriseQuestionAnswers, []);

    const output = answers.filter(q => authorisedQuestions?.indexOf(q.qid) == -1).map( (answer,i) => {
            const answersForQuestion = answer.answers.map ( 
                indivAnswer =>     
                    <li key={indivAnswer.id}>{indivAnswer.answer}</li>
                );
            return <div style={{whiteSpace: 'pre-wrap'}} key={answer.qid}>
                <h4>Question ID {answer.qid}</h4>
                <ul>{answersForQuestion}</ul>
                {answersForQuestion.length > 0 ? 
                <form action={authoriseAnswersWithState}>
                <input type='hidden' name='qid' value={answer.qid} />
                <input type='submit'  value='Authorise All' /> 
                </form> : ''}
            </div>;
    });

    return <div>
        {output.length > 0 ? output: "No answers."}
        Status: {status}<br />
        Authorised questions: {JSON.stringify(authorisedQuestions)}<br />
        </div>;
}
