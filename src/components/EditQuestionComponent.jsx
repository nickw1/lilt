"use client"

import { useState } from 'react';
import QOptionsComponent from './QOptionsComponent.jsx';

export default function EditQuestion({question, onQuestionDeleted}) {

    const [questionDetails, setQuestionDetails] = useState(question);
    const [options, setOptions] = useState('');

    return <div>
        <h4>Question with ID {questionDetails.qid}</h4>
        <div> Question text: <br />
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
        <button onClick={editQuestion}>Edit</button>
        <button onClick={deleteQuestion}>Delete</button>
        </div>;

    async function editQuestion() {
        try {
            const response = await fetch(`/api/question/${questionDetails.qid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({
                    question: questionDetails.question, 
                    options: options.length ? 
                        options.split('*').splice(1).map(opt => opt.trim()) 
                        : []
                })
            });
            alert(response.status == 200 ? 'Successfully updated' : `Error updating, code ${response.status}.`);
        } catch(e) {
            alert(`Error: ${e.message}`);
        }
    }

    async function deleteQuestion() {
        try {
            const response = await fetch(`/api/question/${questionDetails.qid}`, {
                method: 'DELETE'
            });
            if(response.status == 200) {
                alert('Successfully deleted.');
                onQuestionDeleted(questionDetails.qid);
            } else {
                alert(`Error deleting, code ${response.status}.`);
            }
        } catch(e) {
            alert(`Error: ${e.message}`);
        }
    }
}
