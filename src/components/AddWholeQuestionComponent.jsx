"use client"

import AddQuestionComponent from './AddQuestionComponent.jsx';
import { useState } from 'react';


export default function AddWholeQuestionComponent({onQuestionsSubmitted, btnText, allowNoQuestions}) {
    const [questions, setQuestions] = useState([]);

    const [qType, setQType] = useState(0);

    const displayedQuestions = 
        questions.map ((q,i) =>
        <li key={i}>{q.question} {q.options ? `[${q.options.join(',')}]` : ""} <input type='button' value='Remove' onClick={() => { 
            const newQuestions = structuredClone(questions);
            newQuestions.splice(i,1);
            setQuestions(newQuestions);
        }} /></li>);

        return <><div style={{
                backgroundColor: "#e0e0e0", 
                borderRadius: "8px",
                padding: "8px",
                width: "50%",
                height: "200px",
                overflow: "auto"}}>
            Question type:
            <select id='questionType' onChange={addQuestion} defaultValue={qType}>
            <option value='0'>--Select--</option>
            <option value='1'>Text</option>
            <option value='2'>Multiple choice</option>
            </select>
            <br />
            { qType > 0 ?
            <>
            <AddQuestionComponent qType={qType} onQuestionAdded={onQuestionAdded}/>
            </> : "" }
            </div>
            <div>
            { displayedQuestions.length ? 
            <><h4>Questions so far</h4>
            <ul>{displayedQuestions}</ul></> : "" }
            {questions.length ? <p>{questions.length} questions added so far.</p>: ""}
            { questions.length || allowNoQuestions  ? <><input type='button' value={btnText} onClick={submitQuestions} /><br /></> : ""  }
            </div>
            </>;

    function addQuestion(e) {
        setQType( parseInt(e.target.value) );
    }

    function onQuestionAdded(q) {
        const qs = structuredClone(questions);
        qs.push(q);
        setQuestions(qs);
    }

    function submitQuestions() {
        if(onQuestionsSubmitted(questions)) {
            setQuestions([]);
        }
    }
}
