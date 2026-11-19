"use client"

import { useState, useEffect } from 'react';
import QOptionsComponent from './QOptionsComponent';
import ConfirmDeleteComponent from './ConfirmDeleteComponent';
import Flash from './Flash';
import { editQuestion, deleteQuestion } from '../actions/question';
import type { EditQuestionProps, Question } from '../types';

export default function EditQuestionComponent({question, num, onQuestionDeleted}: EditQuestionProps) {

    const [questionDetails, setQuestionDetails] = useState<Question>(question);
    const [options, setOptions] = useState<any>(question.options); 
    const [status, setStatus] = useState<{message?: string, error?: string}>({message: ''});

    useEffect(() => {
        setOptions(question.options?.map(option => `* ${option}`).join('\n') ?? "")
    }, [question]);

    return <div>
        <div style={{marginTop: '10px'}}>
        <h4 style={{display: 'inline'}}>Question {num}</h4>
        <span title='Delete Question'><ConfirmDeleteComponent color='red' onDeleteConfirmed={del} /></span>
        </div>
        <div> 
            <textarea onChange={ e => {
            const newQDetails = structuredClone(questionDetails);
            newQDetails.question = e.target.value;
            setQuestionDetails(newQDetails);
            setStatus({message: ""});
        }} defaultValue={questionDetails.question} 
        style = {{ width: "40%", height: "100px" }}></textarea>
        {question.options ? 
            <QOptionsComponent 
                options={options}
                onOptionsChanged={ opts => {
                    setOptions(opts) 
                    setStatus({message: ""});
                }}
            /> : "" }
        </div>
        <button onClick={edit}>Save</button>
        <Flash style={{backgroundColor: status.error ? '#ffc0c0': '#c0ffc0'}} msg={status.error || status.message} />
        </div>;

    async function edit() {
        try {
            const results = await editQuestion(questionDetails.qid!, questionDetails.question, options ? options.split('*').splice(1).map((opt: string) => opt.trim()) : []);
            setStatus(results.error ? {error: results.error} : {message: "Successfully updated."});
        } catch(e: any) {
            setStatus({error: e.message});
        }
    }

    async function del() {
        try {
            const results = await deleteQuestion(questionDetails.qid!);
            onQuestionDeleted(questionDetails.qid!);
            setStatus(results.error ? {error: results.error} : {message: "Successfully deleted."});
        } catch(e: any) {
            setStatus({error: e.message});
        }
    }
}
