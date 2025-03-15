import React, { useEffect, useState } from 'react';
import { Interweave } from 'interweave';

export default function ExerciseComponent({exercise}) {

    const [content, setContent] = useState([]);

    useEffect( () => {
        const formId = `ex${exercise.id}`; 
        const arr = [];
        let options;
        for(let item of exercise.content) {
            if(item.exercise) {
                const q = item.exercise.questions.map (question => {
                    const fieldId = `q${question.qid}`;
                    if(question.options) {
                        let options = question.options.map ( option =>  {
                            return <option>{option}</option>;
                        });
                        return <li key={fieldId}><span>{question.question}</span><br /><select id={fieldId}>{options}</select></li>

                    } else {
                        return <li key={fieldId}><span>{question.question}</span><br /><textarea style={{width:'50%', height: '50px'}} id={fieldId}></textarea></li>;
                    }    
                });
                arr.push(<form id={formId}>{item.exercise.intro}
                    <ul>{q}</ul>
                    { !exercise.completed || !exercise.showInputs ? <input type='button' value='Answer Questions' onClick={answerQuestions} /> : <em>Submission disabled now you have completed or the notes have been made public.</em> } </form>);
            } else {
                arr.push(<Interweave content={item} />);
            }
        }
        setContent(arr);
    }, [exercise]);    

    return <div>{content}</div>;

    async function answerQuestions() {
        const answers = Array.from(document.getElementById(`ex${exercise.id}`)
            .querySelectorAll("textarea,input[type=text],select"))
            .map ( element => {
                return { qid: element.id.substr(1), answer: element.value.trim() == "" ? "No answer" : element.value }
            } );
        try {
            const response = await fetch('/answer/multiple', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({answers})
            });
            const json = await response.json();
            if(response.status == 200) {
                if(json.status.length > 0) {
                    alert(json.status.join("\n"));
                } else {
                    alert('Question(s) answered successfully');
                }
            } else {
                alert(json.error);
            }
        } catch(e) {
            alert('Internal error');
        }
    } 
}
