import { useState, useEffect } from 'react';
import EditQuestion from './editquestion.jsx';

export default function EditExercise({exNum, exId}) {


    const [exDetails, setExDetails] = useState({
        intro: "",
        questions: []
    });

    useEffect( ()  => {
            fetch(`/exercise/${exId}`)    
                .then(response => response.json())
                .then(json => {
                    if(json?.intro && json?.questions) {
                        console.log(`Effect: Fetching ${exId} json ${JSON.stringify(json)}`);
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

    console.log(JSON.stringify(exDetails.questions));
    
    return <div>
        <h3>Exercise {exNum} (ID {exId})</h3>
        <p><textarea style={{width:"40%", height: "200px"}} 
            onChange={ e => {
                const newExDetails = structuredClone(exDetails);
                newExDetails.intro = e.target.value;
                setExDetails(newExDetails);
            }
        } value={exDetails.intro} />
        <br />
        <button onClick={editExercise}>Edit</button>
        <button onClick={deleteExercise}>Delete</button>
        </p>
        {qOutput}
        </div>;

    async function editExercise() {
        try {
            const response = await fetch(`/exercise/${exId}`, {
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
            const response = await fetch(`/exercise/${exId}`, {
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
}
