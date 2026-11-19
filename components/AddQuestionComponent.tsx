"use client"

import { useState } from 'react';
import QOptionsComponent from './QOptionsComponent';
import type { AddQuestionProps, Question } from '../types';


export default function AddQuestionComponent({qType, onQuestionAdded}: AddQuestionProps) {

    const [optString, setOptString] = useState("");

    return <div>
        Question text: <br />
        <textarea id='questionText' style={{width: "90%", height: "100px"}}></textarea><br />
        { qType == 2 ? 
            <QOptionsComponent 
                options={optString} 
                onOptionsChanged={ 
                    (newOptString: string) => setOptString(newOptString) 
                } />
            : 
        "" 
        }
        <br />
        <input type='button' value='Add Question' onClick={processQuestion} />
        </div>

    function processQuestion() {
        const q : Question = { question: "", options: [] };
        q.question = (document.getElementById('questionText') as HTMLInputElement).value;
        if(qType == 2) {
            q.options = optString.split('*').splice(1).map ( opt => opt.trim() );
        }
        onQuestionAdded(q);
        (document.getElementById('questionText') as HTMLInputElement).value = "";
        setOptString("");
    }
            
}
