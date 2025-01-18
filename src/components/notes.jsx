import React, { useState, useEffect, Fragment } from 'react';
import ExerciseComponent from './exercise.jsx';
import TopicListComponent from './topiclist.jsx';
import TopicNavComponent from './topicnav.jsx';
import { Interweave } from 'interweave';

export default function NotesComponent({usercode, module, initTopic}) {

    const [topicsList, setTopicsList] = useState([]);
    const [content, setContent] = useState([]);
    const [topic, setTopic] = useState(initTopic || 0);

    useEffect( () => {
        if(!module) {
            setContent(<p>Please select a module.</p>);
        } else { 
            fetch(`/topic/${module}/all`)
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
                        throw new Error(`Notes for topic ${topic} for module ${module} do not exist yet.`);
                    } else {
                        return response.json();
                    }
                })
                .then(json => {
       
                    if(json.error) {
                        throw(json.error);
                    }
 
                    const parts = [];
    
                    if(json.header) {
                        parts.push(<header key={key++} className='notesHeader'><Interweave content={json.header} /></header>);
                    }

                    for(let section of json.main) {
                        switch(section.type) {
                            case "public":
                                parts.push(<Interweave key={key++} content={section.content} />);
                                break;
    
                            case "protected":
                                if(section.discussionForExercise) {
                                    parts.push(<h2 key={key++}>Discussion on exercise {section.discussionForExercise}</h2>);
                                }
                                if(section.status === "unmetDependencies") {
                                    parts.push(
                                        <div key={key++}>
                                        <p style={dependencyMsgStyle}>
                                        <em>Further content is available, but you need to complete Exercise {section.dependencies} and have your answers authorised by the tutor to view it.</em>
                                        </p>
                                        </div>);
                                } else {
                                    parts.push(<Interweave key={key++} content={section.content} />);
                                }
                                break;
                    
                            case "exercise":
                                parts.push(<h2 key={key++}>Exercise {section.publicNumber}</h2>);
                                if(section.status === "unmetDependencies") {
                                    parts.push(
                                        <p style={dependencyMsgStyle} 
                                        key={key++}>
                                        <em>You need to complete Exercise {section.dependencies} first before attempting Exercise {section.publicNumber}.</em>
                                        </p>);
                                } else if (section.status === 'notLoggedIn') {
                                    parts.push(<p key={key++} style={dependencyMsgStyle}><em>You need to be logged in to attempt Exercise {section.publicNumber}.</em></p>);
                                } else {
                                     if (section.completed === true) {
                                        parts.push(
                                            <p key={key++}><em>You have completed exercise {section.publicNumber}. If you do not see the discussion below the exercise, the tutor may need to authorise your answers.</em></p>
                                        );
                                    }
                                    parts.push(<ExerciseComponent key={key++} exercise={section} />);
                                }
                    }
                }
                setContent(parts);
            })
            .catch(e =>  { 
                setContent(<p>{e.toString()}</p>); 
               })
        } else if (module) {
            setContent(<p>Please select a topic.</p>);
        }
    }, [topic, module, usercode]);

    const displayedTopics = topic == 0 ? 
        <TopicListComponent module={module} topicsList={topicsList} /> :
        <TopicNavComponent module={module} topicsList={topicsList} currentTopic={topic} /> ;
               
    return <div>
        {displayedTopics}
        <div>{content}</div>
        </div>;
}
