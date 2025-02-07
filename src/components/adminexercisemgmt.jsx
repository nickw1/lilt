import React, { useState, useEffect } from 'react';

import EditExercise from './editexercise.jsx';
import AdminAnswersComponent from './adminanswers.jsx';

export default function AdminExerciseManagementComponent() {

    const [answers, setAnswers] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [exerciseDetail, setExerciseDetail] = useState([1,1]);

    useEffect( () => {
        fetch('/exercise/all')
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
        <EditExercise exId={exerciseDetail[0]} exNum={exerciseDetail[1]} />
        <AdminAnswersComponent exId={exerciseDetail[0]} exNum={exerciseDetail[1]} />
        </div>;

} 
