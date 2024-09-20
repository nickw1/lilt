import React, { useState } from 'react';

export default function AdminAddModuleComponent({onModuleAdded}) {

    return <div>
        <h3>Add Module</h3>
        Module code: <br />
        <input id='moduleCode' type='code' /><br />
        Module name: <br />
        <input id='moduleName' type='text' style={{width:"400px"}}/><br />
        <input type='button' value='Go!' onClick={addModule} />
        </div>;

    async function addModule() {
        try {
            const module = {
                code: document.getElementById('moduleCode').value,
                name: document.getElementById('moduleName').value
            };

            const response = await fetch('/module/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(module)
            });
            const json = await response.json();
            if(response.status == 200) {
                alert(`ID in database: ${json.id}`);
                module.id = json.id;
                onModuleAdded(module);
            } else {
                alert(json.error);
            }
        } catch(e) {    
            alert(e);
        }
    }
}
