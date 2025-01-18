import React, { useState, useEffect } from 'react';
import AddQuestionComponent from './addquestion.jsx';
import { useRouteLoaderData } from 'react-router-dom';
import ModuleChooseComponent from './modulechoose.jsx';

export default function AddExerciseComponent() {

    const [qType, setQType] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [moduleTopics, setModuleTopics] = useState([]);
    const [moduleCode, setModuleCode] = useState("");

    const displayedQuestions = moduleCode != "" ?
        questions.map ((q,i) =>
        <li key={i}>{q.question} {q.options ? `[${q.options.join(',')}]` : ""} <input type='button' value='Remove' onClick={() => { 
            const newQuestions = structuredClone(questions);
            newQuestions.splice(i,1);
            setQuestions(newQuestions);
        }} /></li>) : "";

    return <div>
            <h2>Add an Exercise</h2>
            <form>
            <ModuleChooseComponent onModuleChosen={code => {
                populateTopics(code);
                setModuleCode(code);
            }} />
            <br />
            Topic Number: <br />
            <select id='topicNumber'>
            { moduleTopics.map ( number => <option>{number}</option> ) }
            </select>
            <br />
            Exercise Introduction:<br />
            <textarea id='intro' style={{width:'50%', height:'100px'}}></textarea>
            { moduleCode != "" ? 
            <>
            <h3>Add a question to the exercise</h3>
            <div style={{
                backgroundColor: "#e0e0e0", 
                borderRadius: "8px",
                padding: "8px",
                width: "50%",
                height: "200px",
                overflow: "auto"}}>
            Question type:
            <select id='questionType' onChange={addQuestion} value={qType} defaultValue={qType}>
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
            </> : "" }
            <h4>Questions so far</h4>
            <ul>{displayedQuestions}</ul>
            {questions.length ? <p>{questions.length} questions added so far.</p>: ""}
            { moduleCode != "" && questions.length > 0 ? <><input type='button' value='Save Exercise To Database' onClick={saveExerciseToServer} /><br /></> : "" }
            </form>
            </div>

    function addQuestion() {
        setQType( parseInt(document.getElementById('questionType').value) );
    }

    function onQuestionAdded(q) {
        const qs = structuredClone(questions);
        qs.push(q);
        setQuestions(qs);
        setQType(0);    
        //document.getElementById('questionType').value = 0;
    }

    async function populateTopics(code) {
        
        if(code != "") {
            try {
                const response = await fetch(`/topic/${code}/all`);
                const topics = await response.json();
                setModuleTopics(topics.map (topic => topic.number));
            } catch(e) {
                alert(e.toString());
            }
        } else {
            setModuleTopics([]);
            setCompletedModuleDetails(false);
        }
    }

    async function saveExerciseToServer() {
        // each question object has question (and options if applicable)
        try {
            const topic = document.getElementById('topicNumber').value;
            const intro = document.getElementById('intro').value;
            const response = await fetch('/exercise/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({topic, intro, questions, moduleCode})
            });
            const json = await response.json();
            if(response.status == 200) {
                alert('Saved exercise');
                setQuestions([]);
            } else {
                alert(json.error);
            }
        } catch(e) {
            alert('Internal error');
        }
    }
}
