"use client"

import { useState, useContext } from 'react';
import AddWholeQuestionComponent from './AddWholeQuestionComponent';
import { addExercise } from '../actions/exercise';
import ModuleContext from '../context/module';
import Flash from './Flash';
import type { AddExerciseReturn, Topic, Question } from '../types';

export default function AddExerciseComponent({ topics }: { topics: Topic[] }) {

    const moduleInfo = useContext(ModuleContext);
    const [addExerciseState, setAddExerciseState] = useState<{ value: string, colour?: string }>({
        value: ""
    });
    let results: AddExerciseReturn | null = null;
    return <><div>
        <h3>Add an Exercise</h3>
        <br />
        Topic Number: <br />
        <select id='topicNumber'>
            {topics.map((topic: Topic) => <option key={topic.id}>{topic.number}</option>)}

        </select>
        <br />
        Exercise Introduction:<br />
        <textarea id='exIntro' style={{ width: '50%', height: '100px' }} onChange={() => setAddExerciseState({
            value: ""
        })}></textarea>
        {moduleInfo.code != "" ?
            <AddWholeQuestionComponent btnText='Save Exercise To Database' onQuestionsSubmitted={async (questions: Question[]) => {
                results = await addExercise({
                    topic: parseInt((document.getElementById('topicNumber') as HTMLInputElement).value),
                    intro: (document.getElementById('exIntro') as HTMLInputElement).value,
                    questions,
                    moduleCode: moduleInfo.code
                });

                setAddExerciseState({
                    colour: results.error ? '#ffc0c0' : '#c0ffc0',
                    value: results.eid ? `Added exercise with ID ${results.eid}` : (results.error || "")
                });
                (document.getElementById('exIntro') as HTMLInputElement).value = '';
                return results.eid ? true : false;
            }} allowNoQuestions={true} />
            : ""}
        <Flash time={5000} style={{ backgroundColor: addExerciseState.colour }} msg={addExerciseState.value} />
    </div>
    </>;

}
