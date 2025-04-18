import React, { useState, useEffect, useContext } from 'react';
import AddQuestionComponent from './addquestion.jsx';
import AddQuestionsComponent from './addquestions.jsx';
import { useRouteLoaderData } from 'react-router-dom';
import ModuleChooseComponent from './modulechoose.jsx';
import ModulesContext from '../context/modulescontext.mjs';

export default function AddExerciseComponent() {

    const [moduleTopics, setModuleTopics] = useState([]);
    const [moduleCode, setModuleCode] = useState("");
    const modules = useContext(ModulesContext);


    return <><div>
            <h2>Add an Exercise</h2>
            <ModuleChooseComponent modules={modules} onModuleChosen={code => {
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
            <AddQuestionsComponent btnText='Save Exercise To Database' onQuestionsSubmitted={saveExerciseToServer} allowNoQuestions='true' />
             : "" }
            </div>
            </>;



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

    async function saveExerciseToServer(questions) {
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
                return true;
            } else {
                alert(json.error);
                return false;
            }
        } catch(e) {
            alert('Internal error');
            return false;
        }
    }
}
