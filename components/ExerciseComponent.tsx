"use client"

import { useActionState, useRef } from 'react';
import Markdown, { MarkdownToJSX, RuleType } from 'markdown-to-jsx';
import { answerQuestions } from '../actions/answer';
import SyntaxHighlight from './SyntaxHighlight';
import Flash from './Flash';
import type { ExerciseComponentProps, AnswerQuestionsState } from '../types/';

export default function ExerciseComponent({ exercise, submittable }: ExerciseComponentProps) {

    let keyCount = 0;
    const lastPing = useRef(0);

    function renderRuleHandler(next: () => React.ReactNode, node: MarkdownToJSX.ASTNode, renderChildren: MarkdownToJSX.ASTRender) {
        return node.type == RuleType.codeBlock ?
            <SyntaxHighlight key={`ex-${exercise.id}-code-${keyCount++}`} lang={node.lang}>
                {node.text.replace("&lt;", "<").replace("&gt;", ">")}
            </SyntaxHighlight>
            : next()
    }

    const formId = `ex${exercise.id}`;
    let hasQuestions = false;
    const [answerState, answerQuestionsWithState] = useActionState<AnswerQuestionsState, FormData>(answerQuestions, { status: "", answered: [] });
    const q = exercise.questions.map(question => {
        const fieldId = `q${question.qid}`;
        if (question.options) {
            let options = question.options.map((option: string, i: number) => {
                return <option key={`${fieldId}-${i}`}>{option}</option>;
            });
            hasQuestions = true;
            return <li key={fieldId}><span>{question.question}</span><br /><select id={fieldId} name={fieldId} defaultValue={question.options[0]}>{options}</select></li>

        } else {
            if (question.question) hasQuestions = true;

            return <li key={fieldId}>
                <Markdown options={{
                    renderRule: renderRuleHandler,
                    disableParsingRawHTML: true,
                    overrides: {
                        iframe: () => null,
                        script: () => null,
                        object: () => null,
                        style: () => null,
                        img: ({ ...props }) => props.src.startsWith("/static/") ? <img {...props} /> : null,
                    }
                }}>{question.question}</Markdown>
                <br />
                <textarea onChange={async () => {
                    // Ping the server every minute when the user enters 
                    // something, to prevent the session timing out 
                    // during a long exercise. Also check user is still
                    // logged in.
                    const time = new Date().getTime();
                    if (time - lastPing.current > 3000) {
                        const response = await fetch(`/user/current?time=${time}`);

                        const { loggedIn } = await response.json();

                        if (!loggedIn) {
                            alert("You are not logged in. If you were not expecting this, your session may have timed out, in which case you need to login again.");
                        }
                        lastPing.current = time;
                    }
                }} style={{ width: '50%', height: '50px' }} id={fieldId} name={fieldId}></textarea></li>;
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
                style: () => null,
                img: ({ ...props }) => props.src.startsWith("/static/") ? <img {...props} /> : null,
            }
        }}>{exercise.intro}</Markdown>
        <ul>{q}</ul>
        {submittable ? (hasQuestions ? <input type='submit' value='Answer Questions' /> : "") : <em>Submission disabled now you have completed or the notes have been made public.</em>} </form>;

    const renderedStatus = Array.isArray(answerState.status) ? answerState.status.join("<br />") : answerState.status;
    return <div>
        {content}
        <Flash style={{ backgroundColor: '#ffffc0' }} msg={renderedStatus || ""} />
        {answerState.error ? <Flash style={{ backgroundColor: '#ffc0c0' }} msg={`Error: ${answerState.error}`} /> : ""}</div>;
}
