"use client"

import React, { useActionState } from 'react';
import Markdown, { RuleType } from 'markdown-to-jsx';
import { answerQuestions } from '../actions/answer.mjs';
import SyntaxHighlight from './SyntaxHighlight.jsx';

export default function ExerciseComponent({exercise, submittable}) {

    let keyCount = 0;

    function renderRuleHandler (next, node, renderChildren) {
        return node.type == RuleType.codeBlock ?
            <SyntaxHighlight key={`ex-${exercise.id}-code-${keyCount++}`} lang={node.lang}>
                    {node.text.replace("&lt;", "<").replace("&gt;",">")}
                    </SyntaxHighlight> 
                    : next()
    }

    const formId = `ex${exercise.id}`; 
    let options, realQuestion = false;
    const [ answerState, answerQuestionsWithState ] = useActionState(answerQuestions, { status: "", error: null, answered: [] });
    const q = exercise.questions.map (question => {
        const fieldId = `q${question.qid}`;
        if(question.options) {
            let options = question.options.map ( (option,i) =>  {
                return <option key={`${fieldId}-${i}`}>{option}</option>;
            });
            return <li key={fieldId}><span>{question.question}</span><br /><select id={fieldId} name={fieldId} defaultValue={question.options[0]}>{options}</select></li>

        } else {
            if(question.question) realQuestion = true;

            return question.question ? 
                <li key={fieldId}>
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
                <textarea style={{width:'50%', height: '50px'}} id={fieldId} name={fieldId}></textarea></li> : 
                <input type='hidden' key={fieldId} name={fieldId} id={fieldId} value='Answered' /> }
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
        { submittable ? <input type='submit' value={realQuestion ? 'Answer Questions' : 'Click when complete'} onClick={answerQuestions} /> : <em>Submission disabled now you have completed or the notes have been made public.</em> } </form>;
  
    return <div>
        {content}
        <p style={{backgroundColor: '#ffffc0'}}>{answerState.status || ""}</p>
        { answerState.error ? <p style={{backgroundColor: '#ffc0c0'}}>Error: {answerState.error}</p> : ""}</div>;
}
