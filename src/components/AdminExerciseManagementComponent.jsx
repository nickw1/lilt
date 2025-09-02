"use client"
import React, { useState } from 'react';

import EditExerciseComponent from './EditExerciseComponent.jsx';
import AdminAnswersHolder from './AdminAnswersHolder.jsx';
import { getFullExercise } from '../actions/exercise.mjs';

export default function AdminExerciseManagementComponent({allExercises}) {

    const [exercises, setExercises] = useState(allExercises);
    const [curExercise, setCurExercise] = useState(null);


    return <div>
        Choose an exercise:
        <select onChange={async(e) => {
            const [ exid ] = e.target.value.split(':');
            const exer = exercises.find(ex => ex.id == exid)||{};
            const { questions, intro }  = await getFullExercise(exid);
            exer.questions = questions;
            exer.intro = intro;
            setCurExercise(exer);
        }}>
        { exercises.map (exercise => <option key={exercise.id} value={`${exercise.id}:${exercise.publicNumber}`}>{exercise.moduleCode}: T{exercise.topicNumber}: Ex {exercise.publicNumber}</option>) }
        </select>
        { curExercise ? 
        <>
        <EditExerciseComponent exercise={curExercise} onExerciseDeleted={ exId => {
            const newExercises = structuredClone(exercises).filter ( exercise => exercise.id != exId );
            setExercises(newExercises);
            setCurExercise(null);
        }} /> 
        <h2>Answers</h2>
        <h3>Answers for exercise {curExercise?.publicNumber}</h3>
        <AdminAnswersHolder exid={curExercise?.id} />
         </>: "" }
        </div>;
} 
