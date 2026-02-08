"use client"

import React, { useState, useActionState, useRef } from 'react';
import Markdown, { RuleType } from 'markdown-to-jsx';
import { answerQuestions } from '../actions/answer.mjs';
import SyntaxHighlight from './SyntaxHighlight.jsx';

export default function ExerciseComponent({exercise, submittable}) {

    let keyCount = 0;
    const lastPing = useRef(0);

    function renderRuleHandler (next, node, renderChildren) {
        return node.type == RuleType.codeBlock ?
            <SyntaxHighlight key={`ex-${exercise.id}-code-${keyCount++}`} lang={node.lang}>
                    {node.text.replace("&lt;", "<").replace("&gt;",">")}
                    </SyntaxHighlight> 
                    : next()
    }

    const formId = `ex${exercise.id}`; 
    let options, hasQuestions = false;
    const [ answerState, answerQuestionsWithState ] = useActionState(answerQuestions, { status: "", error: null, answered: [] });
    const q = exercise.questions.map (question => {
        const fieldId = `q${question.qid}`;
        if(question.options) {
            let options = question.options.map ( (option,i) =>  {
                return <option key={`${fieldId}-${i}`}>{option}</option>;
            });
            hasQuestions = true;
            return <li key={fieldId}><span>{question.question}</span><br /><select id={fieldId} name={fieldId} defaultValue={question.options[0]}>{options}</select></li>

        } else {
            if(question.question) hasQuestions = true;

            return <li key={fieldId}>
                <Markdown options={{
                    renderRule: renderRuleHandler,
                    disableParsingRawHTML: true,
                    overrides: {
                        iframe: () => null,
                        script: () => null,
                        object: () => null,
                        style:  () => null,
                        img: ({...props}) => props.src.startsWith("/static/") ? <img {...props} /> : null,
                }}}>{question.question}</Markdown>
                <br />
                <textarea onChange={async() => {
                    // Ping the server every minute when the user enters 
                    // something, to prevent the session timing out 
                    // during a long exercise. Also check user is still
                    // logged in.
                    const time = new Date().getTime();
                    if(time - lastPing.current > 3000) {
                        const response = await fetch(`/user/current?time=${time}`);    
                        const { loggedIn } = await response.json();
                        if(!loggedIn) {
                            alert("Your session has timed out, please login again.");
                        }
                        lastPing.current = time;
                    }
                }} style={{width:'50%', height: '50px'}} id={fieldId} name={fieldId}></textarea></li>;
       }
    });
    const content = <form 
        key={formId} 
        id={formId} 
        action={answerQuestionsWithState}>    
        <Markdown options={{
            renderRule: renderRuleHandler,
            disableParsingRawHTML: true,
            overrides: {
                iframe: () => null,
                script: () => null,
                object: () => null,
                style:  () => null,
                img: ({...props}) => props.src.startsWith("/static/") ? <img {...props} /> : null,
            }}}>{exercise.intro}</Markdown>
        <ul>{q}</ul>
        { submittable ? ( hasQuestions ? <input type='submit' value='Answer Questions' onClick={answerQuestions} /> : "" ) : <em>Submission disabled now you have completed or the notes have been made public.</em> } </form>;
  
    return <div>
        {content}
        <p style={{backgroundColor: '#ffffc0'}}>{answerState.status || ""}</p>
        { answerState.error ? <p style={{backgroundColor: '#ffc0c0'}}>Error: {answerState.error}</p> : ""}</div>;
}
