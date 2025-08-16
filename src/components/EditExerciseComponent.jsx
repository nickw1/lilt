"use client"

import { useState, useEffect } from 'react';
import EditQuestion from './EditQuestionComponent.jsx';
import AddWholeQuestionComponent from './AddWholeQuestionComponent.jsx';
import { editExercise, deleteExercise, addQuestionsToExercise } from '../actions/exercise.mjs';


export default function EditExerciseComponent({exercise, onExerciseDeleted}) {
    const [exDetails, setExDetails] = useState({});

    const [status, setStatus] = useState("");

    useEffect(() => {
        setExDetails(exercise);
        console.log("Exercise:");
        console.log(JSON.stringify(exercise));
    }, [exercise]);
    
    const qOutput = exDetails.questions?.map( question => <EditQuestion key={question.qid} question={question} onQuestionDeleted = { qid => {
        const newExDetails = {
            intro: exDetails.intro,
            questions : exDetails.questions.filter ( question => question.qid != qid )
        };
        setExDetails(newExDetails);
    }}/> );
    

    
    return exDetails.questions === undefined ? "" : <div>
        <h3>Exercise {exDetails.publicNumber} (ID {exDetails.id})</h3>
        <div>
        <textarea style={{width:"40%", height: "200px"}} 
            onChange={ e => {
                const newExDetails = structuredClone(exDetails);
                newExDetails.intro = e.target.value;
                setExDetails(newExDetails);
            }
        } value={exDetails.intro} />
        <br />
        <button onClick={edit}>Edit</button>
        <button onClick={del}>Delete</button>
        {qOutput}
        <p>Edit Exercise Status: {status}</p>
        <h3>Add new questions</h3>
        <AddWholeQuestionComponent btnText='Save Questions To Database' onQuestionsSubmitted={(questions) => {
            return saveQuestionsToServer(exDetails.id, questions);
        }} />
        </div>
        </div>;

    async function edit() {
        try {
            const results = await editExercise(exDetails.id, exDetails.intro);
            setStatus(results.error || "Successfully updated.");
        } catch(e) {
            setStatus(e.message);
        }
    }

    async function del() {
        try {
            const results = await deleteExercise(exDetails.id);
            setStatus(results.error || "Successfully deleted.");
            onExerciseDeleted(exDetails.id);
        } catch(e) {
            setStatus(e.message);
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
                const ed = structuredClone(exDetails);
                questions.forEach ( (q,i) => {
                    q.qid = results.qids[i];
                });
                ed.questions.push(...questions);
                setExDetails(ed);
                setStatus("Questions added successfully");
                return true;
            } else {
                setStatus(results.error);
                return false;
            }
        } catch(e) {
            setStatus(e.message);
            return false;
        }
    }
}
