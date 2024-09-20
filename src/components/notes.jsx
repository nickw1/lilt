import React, { useState, useEffect, Fragment } from 'react';
import ExerciseComponent from './exercise.jsx';
import { Interweave } from 'interweave';

export default function NotesComponent({usercode, module}) {

    const [topicsList, setTopicsList] = useState([]);
    const [content, setContent] = useState([]);
    const [topic, setTopic] = useState(0);

    useEffect( () => {
        if(!module) {
            setContent(<p>Please select a module.</p>);
        } else { 
            fetch( `/topic/${module}/all`)
                .then(response => response.json())
                .then(json => {
                    setTopicsList(json);
                });
        }}, [module]
    );

    useEffect( () => { 
        const dependencyMsgStyle = {
            backgroundColor: '#ffc0c0',
            margin: '4px',
            borderRadius: '4px'
        };

        if(topic > 0) {
            const arr = [];
            let key=0;
            fetch(`/notes/${module}/${topic}.json`)
                .then(response => {
                    if(response.status == 404) {
                        throw new Error(`Topic ${topic} for module ${module} does not exist.`);
                    } else {
                        return response.json();
                    }
                })
                .then(json => {
        
                    const parts = [];
    
                    if(json.header) {
                        parts.push(<header key={key++}><Interweave content={json.header} /></header>);
                    }

                    for(let section of json.main) {
                        console.log(section);
                        switch(section.type) {
                            case "public":
                                parts.push(<Interweave key={key++} content={section.content} />);
                                break;
    
                            case "protected":
                                parts.push(<h2>Discussion on exercise {section.dependencies}</h2>);
                                if(section.status === "unmetDependencies") {
                                    parts.push(
                                        <div>
                                        <p key={key++} style={dependencyMsgStyle}>
                                        <em>Further content is available, but you need to complete Exercise {section.dependencies} and have your answers authorised by the tutor to view it.</em>
                                        </p>
                                        </div>);
                                } else {
                                    parts.push(<Interweave key={key++} content={section.content} />);
                                }
                                break;
                    
                            case "exercise":
                                parts.push(<h2>Exercise {section.id}</h2>);
                                if(usercode) {
                                    if(section.status === "unmetDependencies") {
                                        parts.push(
                                            <p style={dependencyMsgStyle} 
                                            key={key++}>
                                            <em>You need to complete Exercise {section.dependencies} first before attempting Exercise {section.id}.</em>
                                            </p>);
                                    } else if (section.completed === true) {
                                        parts.push(
                                            <p><em>You have completed exercise {section.id}. If you do not see the discussion below the exercise, the tutor may need to authorise your answers.</em></p>
                                        );
                                    } else {
                                        parts.push(<ExerciseComponent key={key++} exercise={section} />);
                                    }
                                } else {
                                    parts.push(<p style={dependencyMsgStyle}><em>You need to be logged in to attempt Exercise {section.id}.</em></p>);
                                } 
                        }
                    setContent(parts);
                }
            })
            .catch(e =>  { 
                setContent(<p>{e.toString()}</p>); 
               })
        } else if (module) {
            setContent(<p>Please select a topic.</p>);
        }
    }, [topic, module, usercode]);

    const displayedTopics = topic == 0 ?
        <ul>
        {topicsList.map( t => 
            <li key={topic.number}>
                <a href='#' onClick={()=>setTopic(t.number)}>{t.number} : {t.title}</a>
            </li>)
        }
        </ul>
        :
        <div style={{display: 'flex', justifyContent:'flex-end'}}>{
            topicsList.map(t => 
                <a style={{
                    padding: '8px', 
                    border: '1px solid black', 
                    backgroundColor: t.number==topic  ? 'blue': 'gray', 
                    color: 'white', 
                    margin: '4px' }} 
                    href='#' 
                    onClick={()=>setTopic(t.number)}>{t.number}</a>
                )
            }</div>;
                
    return <div>{displayedTopics}<div>{content}</div></div>;
}
