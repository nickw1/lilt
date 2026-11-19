"use client"
import { useState } from 'react';

import EditExerciseComponent from './EditExerciseComponent';
import AdminAnswersHolder from './AdminAnswersHolder';
import type { AdminExerciseManagementProps, Exercise } from '../types';

export default function AdminExerciseManagementComponent({allExercises} : AdminExerciseManagementProps) {

    const [exercises, setExercises] = useState(allExercises);
    const [curExercise, setCurExercise] = useState<Exercise | null>(null);


    return <div>
        Choose an exercise:
        <select onChange={async(e) => {
            const [ exid ] = e.target.value.split(':').map (value => parseInt(value));
            const exer : Exercise  = exercises.find((ex: Exercise) => ex.id == exid)||{
                id: -1,
                intro: "",
                questions: [],
                unlocked: false,
                publicNumber: -1
            };
            const response = await fetch(`/exercise/${exid}`);
            const { questions, intro, unlocked }  = await response.json(); 
            exer.questions = questions;
            exer.intro = intro;
            exer.unlocked = unlocked;
            setCurExercise(exer);
        }}>
        { exercises.map (exercise => <option key={exercise.id} value={`${exercise.id}:${exercise.publicNumber}`}>{exercise.moduleCode}: T{exercise.topicNumber}: Ex {exercise.publicNumber}</option>) }
        </select>
        { curExercise ? 
        <>
        <EditExerciseComponent exercise={curExercise} onExerciseDeleted={ (exId: number) => {
            const newExercises = structuredClone(exercises).filter ( exercise => exercise.id != exId );
            setExercises(newExercises);
            setCurExercise(null);
        }} /> 
        <h2>Answers</h2>
        <h3>Answers for exercise {curExercise?.publicNumber}</h3>
        <AdminAnswersHolder exid={curExercise?.id || null} />
         </>: "" }
        </div>;
} 
