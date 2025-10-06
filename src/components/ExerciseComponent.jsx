"use client"

import React, { useActionState } from 'react';
import Markdown, { RuleType } from 'markdown-to-jsx';
import { answerQuestions } from '../actions/answer.mjs';
import SyntaxHighlight from './SyntaxHighlight.jsx';

export default function ExerciseComponent({exercise}) {

    let keyCount = 0;

    function renderRuleHandler (next, node, renderChildren) {
        return node.type == RuleType.codeBlock ?
            <SyntaxHighlight key={`code-${keyCount++}`} lang={node.lang}>
                    {node.text}
                    </SyntaxHighlight> 
                    : next()
    }

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
                <br /><textarea style={{width:'50%', height: '50px'}} id={fieldId} name={fieldId}></textarea></li>;
        }    
    });
    content.push(<form 
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
        { !exercise.completed || !exercise.showInputs ? <input type='submit' value='Answer Questions' onClick={answerQuestions} /> : <em>Submission disabled now you have completed or the notes have been made public.</em> } </form>);
  
    return <div>
        {content}
        <p style={{backgroundColor: '#ffffc0'}}>{answerState.status || ""}</p>
        { answerState.error ? <p style={{backgroundColor: '#ffc0c0'}}>Error: {answerState.error}</p> : ""}</div>;
}
