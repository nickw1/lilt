import { useState, useEffect } from 'react';
import EditQuestion from './EditQuestionComponent.jsx';
import AddQuestionComponent from './AddQuestionComponent.jsx';


export default function EditExerciseComponent({exNum, exId}) {


    const [exDetails, setExDetails] = useState({
        intro: "",
        questions: []
    });

    useEffect( ()  => {
            fetch(`/api/exercise/${exId}`)    
                .then(response => response.json())
                .then(json => {
                    if(json?.intro && json?.questions) {
                        setExDetails(json);
                    } else {
                        setExDetails({intro: "", questions: []});
                    }
                })
               .catch(e => {
                   alert(`Error fetching exercise from the server: ${e.message}`);
               });
    }, [exId]);

    const qOutput = exDetails.questions.map( question => <EditQuestion key={question.qid} question={question} onQuestionDeleted = { qid => {
        const newExDetails = {
            intro: exDetails.intro,
            questions : exDetails.questions.filter ( question => question.qid != qid )
        };
        setExDetails(newExDetails);
    }}/> );

    
    return <div>
        <h3>Exercise {exNum} (ID {exId})</h3>
        <div>
        <textarea style={{width:"40%", height: "200px"}} 
            onChange={ e => {
                const newExDetails = structuredClone(exDetails);
                newExDetails.intro = e.target.value;
                setExDetails(newExDetails);
            }
        } value={exDetails.intro} />
        <br />
        <button onClick={editExercise}>Edit</button>
        <button onClick={deleteExercise}>Delete</button>
        {qOutput}
        <h3>Add new questions</h3>
        <AddQuestionComponent btnText='Save Questions To Database' onQuestionsSubmitted={saveQuestionsToServer} />
        </div>
        </div>;

    async function editExercise() {
        try {
            const response = await fetch(`/api/exercise/${exId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({exercise: exDetails.intro})
            });
            alert(response.status == 200 ? 'Successfully updated' : `Error updating, code ${response.status}.`);
        } catch(e) {
            alert(`Error: ${e.message}`);
        }
    }

    async function deleteExercise() {
        try {
            const response = await fetch(`/api/exercise/${exId}`, {
                method: 'DELETE'
            });
            if(response.status == 200) {
                alert('Successfully deleted.');
                setExDetails({intro: "", questions: []}); 
            } else {
                alert(`Error deleting, code ${response.status}.`);
            }
        } catch(e) {
            alert(`Error: ${e.message}`);
        }
    }

    function onQuestionAdded(q) {
        const ed = structuredClone(exDetails);
        ed.questions.push(q);
        setExDetails(ed);
        //document.getElementById('questionType').value = 0;
    }

    async function saveQuestionsToServer(questions) {
        try {
            const response = await fetch(`/api/exercise/${exId}/questions`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({questions})
            });
            const json = await response.json();
            if(response.status == 200) {
                alert('Added questions to exercise');
                const ed = structuredClone(exDetails);
                questions.forEach ( (q,i) => {
                    q.qid = json.qids[i];
                });
                ed.questions.push(...questions);
                setExDetails(ed);
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
