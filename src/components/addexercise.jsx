import React, { useState } from 'react';
import AddQuestionComponent from './addquestion.jsx';
import { useRouteLoaderData } from 'react-router-dom';

export default function AddExerciseComponent() {

    const [qType, setQType] = useState(0);
    const [questions, setQuestions] = useState([]);

    return <div>
            <h2>Add an Exercise</h2>
            <form>
            Topic Number: <br />
            <input type='number' id='topic' /><br />    
            Exercise Introduction:<br />
            <textarea id='intro' style={{width:'50%', height:'100px'}}></textarea>
            <h3>Add a question to the exercise</h3>
            Question type:
            <select id='questionType' onChange={addQuestion} defaultValue='0'>
            <option value='0'>--Select--</option>
            <option value='1'>Text</option>
            <option value='2'>Multiple choice</option>
            </select>
            <br />
            { qType > 0 ?
            <>
            <AddQuestionComponent qType={qType} onQuestionAdded={onQuestionAdded}/>
            </> : "" }
            <input type='button' value='Save Exercise To Database' onClick={saveExerciseToServer} /><br />
            </form>
            </div>

    function addQuestion() {
        setQType( parseInt(document.getElementById('questionType').value) );
    }

    function onQuestionAdded(q) {
        const qs = structuredClone(questions);
        qs.push(q);
        setQuestions(qs);
        setQType(0);    
    }

    async function saveExerciseToServer() {
        // each question object has question (and options if applicable)
        try {
            const topic = document.getElementById('topic').value;
            const intro = document.getElementById('intro').value;
            const response = await fetch('exercise/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({topic, intro, questions})
            });
            const json = await response.json();
            if(response.status == 200) {
                alert('Saved exercise');
            } else {
                alert(json.error);
            }
        } catch(e) {
            alert('Internal error');
        }
    }
}
