"use client"

import { useState } from 'react';
import QOptionsComponent from './QOptionsComponent.jsx';
import ConfirmDeleteComponent from './ConfirmDeleteComponent.jsx';
import { editQuestion, deleteQuestion } from '../actions/question.mjs';

export default function EditQuestion({question, num, onQuestionDeleted}) {

    const [questionDetails, setQuestionDetails] = useState(question);
    const [options, setOptions] = useState('');
    const [status, setStatus] = useState({message: ''});

    return <div>
        <div style={{marginTop: '10px'}}>
        <h4 style={{display: 'inline'}}>Question {num}</h4>
        <span title='Delete Question'><ConfirmDeleteComponent color='red' onDeleteConfirmed={del} /></span>
        </div>
        <div> 
            <input type='text' onChange={ e => {
            const newQDetails = structuredClone(questionDetails);
            newQDetails.question = e.target.value;
            setQuestionDetails(newQDetails);
        }} defaultValue={questionDetails.question} 
        style = {{ width: "40%" }} />
        {question.options ? 
            <QOptionsComponent 
                options={question.options.map (option => 
                    `* ${option}`).join('\n')
                } 
                onOptionsChanged={ opts => setOptions(opts) }
            /> : "" }
        </div>
        <button onClick={edit}>Save</button>
        <p style={{backgroundColor: status.error ? '#ffc0c0': '#c0ffc0'}}>{status.error || status.message}</p>
        </div>;

    async function edit() {
        try {
            const results = await editQuestion(questionDetails.qid, questionDetails.question, options ? options.split('*').splice(1).map(opt => opt.trim()) : []);
            setStatus(results.error ? {error: results.error} : {message: "Successfully updated."});
        } catch(e) {
            setStatus({error: e.message});
        }
    }

    async function del() {
        try {
            const results = await deleteQuestion(questionDetails.qid);
            onQuestionDeleted(questionDetails.qid);
            setStatus(results.error ? {error: results.error} : {message: "Successfully deleted."});
        } catch(e) {
            setStatus({error: e.message});
        }
    }
}
