"use client"

import { useState, useEffect } from 'react';
import EditQuestion from './EditQuestionComponent.jsx';
import AddWholeQuestionComponent from './AddWholeQuestionComponent.jsx';
import ConfirmDeleteComponent from './ConfirmDeleteComponent.jsx';
import { editExercise, deleteExercise, addQuestionsToExercise } from '../actions/exercise.mjs';


export default function EditExerciseComponent({exercise, onExerciseDeleted}) {
    const [exDetails, setExDetails] = useState({});

    const [editStatus, setEditStatus] = useState({message: ""});
    const [addQuestionStatus, setAddQuestionStatus] = useState({message: ""});

    useEffect(() => {
        setExDetails(exercise);
    }, [exercise]);
    
    const qOutput = exDetails.questions?.map( question => <EditQuestion key={question.qid} question={question} onQuestionDeleted = { qid => {
        const newExDetails = {
            id: exDetails.id,
            publicNumber: exDetails.publicNumber,
            intro: exDetails.intro,
            questions : exDetails.questions.filter ( question => question.qid != qid )
        };
        setExDetails(newExDetails);
    }}/> );
    

    
    return exDetails.questions === undefined ? "" : <div>
        <div style={{marginTop: '10px'}}><h3 style={{display: 'inline'}}>Exercise {exDetails.publicNumber} (ID {exDetails.id})</h3>
        <span title='Delete exercise'><ConfirmDeleteComponent color='red' onDeleteConfirmed={del} /></span>
        </div>
        <div>
        <textarea style={{width:"40%", height: "200px"}} 
            onChange={ e => {
                const newExDetails = structuredClone(exDetails);
                newExDetails.intro = e.target.value;
                setExDetails(newExDetails);
            }
        } value={exDetails.intro} />
        <br />
        <button onClick={edit}>Save</button>
        <p style={{backgroundColor: editStatus.error ? '#ffc0c0' : '#c0ffc0'}}>{editStatus.error || editStatus.message}</p>
        {qOutput}
        <h3>Add new questions</h3>
        <AddWholeQuestionComponent btnText='Save Questions To Database' onQuestionsSubmitted={(questions) => {
            return saveQuestionsToServer(exDetails.id, questions);
        }} />
        <p style={{backgroundColor: addQuestionStatus.error ? '#ffc0c0' : '#c0ffc0'}}>{addQuestionStatus.error || addQuestionStatus.message}</p>
        </div>
        </div>;

    async function edit() {
        try {
            const results = await editExercise(exDetails.id, exDetails.intro);
            setEditStatus(results.error ? {error: results.error} : {message: "Successfully updated."});
        } catch(e) {
            setEditStatus({error: e.message});
        }
    }

    async function del() {
        try {
            const results = await deleteExercise(exDetails.id);
            setEditStatus(results.error ? {error: results.error} : {message: "Successfully deleted."});
            onExerciseDeleted(exDetails.id);
        } catch(e) {
            setEditStatus({error: e.message});
        }
    }

    function onQuestionAdded(q) {
        const ed = structuredClone(exDetails);
        ed.questions.push(q);
        setExDetails(ed);
        //document.getElementById('questionType').value = 0;
    }

    async function saveQuestionsToServer(id, questions) {
        try {
            const results = await addQuestionsToExercise(id, questions);
            if(results.qids) {
                const newExDetails = structuredClone(exDetails);
                questions.forEach ( (q,i) => {
                    q.qid = results.qids[i];
                });
                newExDetails.questions.push(...questions);
                setExDetails(newExDetails);
                setAddQuestionStatus({message: "Questions added successfully"});
                return true;
            } else {
                setAddQuestionStatus({error: results.error});
                return false;
            }
        } catch(e) {
            setAddQuestionStatus({error: e.message});
            return false;
        }
    }
}
