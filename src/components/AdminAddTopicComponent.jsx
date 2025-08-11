"use client"

import React, { useState, useContext } from 'react';
import ModuleChooseComponent from './ModuleChooseComponent.jsx';
import ModulesContext from '../context/modulescontext.mjs';

export default function AdminAddTopicComponent({action}) {

    const [moduleCode, setModuleCode] = useState("");
    const modules = useContext(ModulesContext);
    return <div>
        <h3>Add Topic</h3>
		<form action={action}>
        <ModuleChooseComponent modules={modules} onModuleChosen={code=>{
            setModuleCode(code);
        } } /><br />
		<input type='hidden' name='operation' value='addTopic' />
		<input type='hidden' name='moduleCode' value={moduleCode} />
        Topic number: <br />
        <input id='topicNumber2' name='topicNumber2' type='number' /><br />
        Topic title: <br />
        <input id='topicTitle' name='topicTitle' type='text' style={{width:"400px"}}/><br />
        <input type='submit' value='Go!'/>
        </form>
        </div>;

}
