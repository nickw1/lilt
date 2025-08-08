"use client"
import React, { useState, useEffect } from 'react';

import EditExerciseComponent from './EditExerciseComponent.jsx';
import AdminAnswersComponent from './AdminAnswersComponent.jsx';

export default function AdminExerciseManagementComponent() {

    const [answers, setAnswers] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [exerciseDetail, setExerciseDetail] = useState([1,1]);

    useEffect( () => {
        fetch('/api/exercise/all')
            .then(response => response.json())
            .then(json => {
                setExercises(json);
            })
    }, []);


    return <div>
        Choose an exercise:
        <select onChange={(e) => {
            setExerciseDetail(e.target.value.split(':'));
        }}>
        { exercises.map (exercise => <option key={exercise.id} value={`${exercise.id}:${exercise.publicNumber}`}>{exercise.moduleCode}: T{exercise.topicNumber}: Ex {exercise.publicNumber}</option>) }
        </select>
        <EditExerciseComponent exId={exerciseDetail[0]} exNum={exerciseDetail[1]} onExerciseDeleted={ exId => {
            const newExercises = structuredClone(exercises).filter ( exercise => exercise.id != exId );
            setExercises(newExercises);
            setExerciseDetail(newExercises.length > 0 ? [newExercises[0].id, newExercises[0].publicNumber] : [1,1]);
        }}/>
        <AdminAnswersComponent exId={exerciseDetail[0]} exNum={exerciseDetail[1]} />
        </div>;

} 
