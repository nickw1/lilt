"use client"
import { useState } from 'react';
import { addModule } from '../actions/module.mjs';

export default function AdminAddModuleComponent({onModuleAdded}) {

    const [status, setStatus] = useState("");
    return <div>
        <h3>Add Module</h3>
        Module code: <br />
        <input id='moduleCode' name='moduleCode' type='text' /><br />
        Module name: <br />
        <input id='moduleName' name='moduleName' type='text' style={{width:"400px"}}/><br />
        <button onClick={onModuleEntered}>Go!</button>
        <div style={{backgroundColor: status.error ? '#ffc0c0': (status.warning ? '#ffffc0' : '#c0ffc0') }}>{status.error || status.warning || (status.id ? "Successfully added module.": "")}</div>
        </div>;

    async function onModuleEntered() {
        try {
            const code = document.getElementById('moduleCode').value, name = document.getElementById('moduleName').value;
            const result = await addModule(code, name);
            if(result.id) {
                onModuleAdded({id: result.id, code, name, visible: 1});
            }
            setStatus(result);
        } catch(e) {
            setStatus({error: e.message}); 
        }
    }
}
