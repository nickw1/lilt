"use client"

import React, { useActionState } from 'react';
import { answerQuestions } from '../actions/answer.mjs';

export default function ExerciseComponent({exercise}) {

    const formId = `ex${exercise.id}`; 
    const content = [];
    let options;
    const [ answerState, answerQuestionsWithState ] = useActionState(answerQuestions, { status: "", error: null, answered: [] });
    const q = exercise.questions.map (question => {
        const fieldId = `q${question.qid}`;
        if(question.options) {
            let options = question.options.map ( (option,i) =>  {
                return <option key={`${fieldId}-${i}`}>{option}</option>;
            });
            return <li key={fieldId}><span>{question.question}</span><br /><select id={fieldId} name={fieldId} defaultValue={question.options[0]}>{options}</select></li>

        } else {
            return <li key={fieldId}><span>{question.question}</span><br /><textarea style={{width:'50%', height: '50px'}} id={fieldId} name={fieldId}></textarea></li>;
        }    
    });
    content.push(<form key={formId} id={formId} action={answerQuestionsWithState}>{exercise.intro}
        <ul>{q}</ul>
        { !exercise.completed || !exercise.showInputs ? <input type='submit' value='Answer Questions' onClick={answerQuestions} /> : <em>Submission disabled now you have completed or the notes have been made public.</em> } </form>);
  
    return <div>
        {content}
        <p style={{backgroundColor: '#ffffc0'}}>{answerState.status || ""}</p>
        { answerState.error ? <p style={{backgroundColor: '#ffc0c0'}}>Error: {answerState.error}</p> : ""}</div>;
}
