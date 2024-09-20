
import React, { useState, Fragment } from 'react';

export default function AddQuestionComponent({qType, onQuestionAdded}) {

    return <div>
        Question text: <br />
        <input id='questionText' /><br />
        { qType == 2 ? 
            <>List the options. Begin each option with a star.<br />
            <textarea id='questionOptions' 
                style={{width:"50%", height:"50px"}}>
            </textarea>
            </>
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
            q.options = document.getElementById('questionOptions')
                .value
                .split("*")
                .splice(1)
                .map (option => option.trim());
        }
        onQuestionAdded(q);
    }
            
}
