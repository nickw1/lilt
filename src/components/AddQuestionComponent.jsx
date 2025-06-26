
import React, { useState } from 'react';
import QOptionsComponent from './QOptionsComponent.jsx';

export default function AddQuestionComponent({qType, onQuestionAdded}) {

    const [optString, setOptString] = useState("");

    return <div>
        Question text: <br />
        <input id='questionText' /><br />
        { qType == 2 ? 
            <QOptionsComponent 
                options={optString} 
                onOptionsChanged={ 
                    newOptString => setOptString(newOptString) 
                } />
            : 
        "" 
        }
        <br />
        <input type='button' value='Add Question' onClick={processQuestion} />
        </div>

    function processQuestion() {
        const q = {};
        q.question = document.getElementById('questionText').value;
        if(qType == 2) {
            q.options = optString.split('*').splice(1).map ( opt => opt.trim() );
        }
        onQuestionAdded(q);
    }
            
}
