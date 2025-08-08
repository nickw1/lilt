"use client"

import React, { useEffect, useState } from 'react';

export default function ExerciseComponent({exercise}) {

    const formId = `ex${exercise.id}`; 
    const content = [];
    let options;
    const q = exercise.questions.map (question => {
        const fieldId = `q${question.qid}`;
        if(question.options) {
            let options = question.options.map ( (option,i) =>  {
                return <option key={`${fieldId}-${i}`}>{option}</option>;
            });
            return <li key={fieldId}><span>{question.question}</span><br /><select id={fieldId} defaultValue={question.options[0]}>{options}</select></li>

        } else {
            return <li key={fieldId}><span>{question.question}</span><br /><textarea style={{width:'50%', height: '50px'}} id={fieldId}></textarea></li>;
        }    
    });
    content.push(<div key={formId} id={formId}>{exercise.intro}
        <ul>{q}</ul>
        { !exercise.completed || !exercise.showInputs ? <input type='button' value='Answer Questions' onClick={answerQuestions} /> : <em>Submission disabled now you have completed or the notes have been made public.</em> } </div>);
  
    return <div>{content}</div>;

    async function answerQuestions() {
        const answers = Array.from(document.getElementById(`ex${exercise.id}`)
            .querySelectorAll("textarea,input[type=text],select"))
            .map ( element => {
                return { qid: element.id.substr(1), answer: element.value.trim() == "" ? "No answer" : element.value }
            } );
        try {
            const response = await fetch('/api/answer/multiple', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({answers})
            });
            const json = await response.json();
            if(response.status == 200) {
                if(json.status.length > 0) {
                    alert(json.status.join("\n"));
                } else {
                    alert('Question(s) answered successfully');
                }
            } else {
                alert(json.error);
            }
        } catch(e) {
            alert('Internal error');
        }
    } 
}
