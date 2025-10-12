"use client"

import React, { useState, useContext } from 'react';
import AddWholeQuestionComponent from './AddWholeQuestionComponent.jsx';
import { addExercise } from '../actions/exercise.mjs';
import ModuleContext from '../context/module.mjs';

export default function AddExerciseComponent({topics}) {

    const moduleInfo = useContext(ModuleContext);
    const [addExerciseState, setAddExerciseState] = useState("");
    let results = null;
    return <><div>
            <h3>Add an Exercise</h3>
            <br />
            Topic Number: <br />
            <select id='topicNumber'>
            { topics.map ( topic => <option key={topic.id}>{topic.number}</option> ) }

            </select>
            <br />
            Exercise Introduction:<br />
            <textarea id='exIntro' style={{width:'50%', height:'100px'}} onChange={() => setAddExerciseState("")}></textarea>
            { moduleInfo.moduleCode != "" ? 
            <AddWholeQuestionComponent btnText='Save Exercise To Database' onQuestionsSubmitted={async(questions) => {
                results = await addExercise({
                    topic: document.getElementById('topicNumber').value,
                    intro: document.getElementById('exIntro').value,
                    questions: questions.length === 0 ? [{question: null, options: null}] : questions,
                    moduleCode: moduleInfo.moduleCode
                });
                setAddExerciseState(results.eid ? `Added exercise with ID ${results.eid}`: (results.error || ""));
                document.getElementById('exIntro').value = '';
                return results.eid ? true : false; 
            }} allowNoQuestions='true' />
             : "" }
            <p style={{backgroundColor: results?.error ? '#ffc0c0' : '#c0ffc0'}} >{addExerciseState}</p>
            </div>
            </>;

}
