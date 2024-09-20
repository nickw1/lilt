import React, { useEffect, useState } from 'react';

export default function ModuleChooseComponent ({onModuleChosen})  {

    const [modules, setModules] = useState([]);


    useEffect(() => {
        fetch('/module/all')
        .then(response => response.json())
        .then(modules => setModules(modules))
    }, []);

    const moduleInfo = modules.map(module => 
        <option key={module.id} value={module.code}>{module.name}</option>
    );

    return <>Please choose a module:
            <select id='moduleCode' onChange={(e)=>{
            if(e.target.value != "") {
                onModuleChosen(e.target.value);
            }
        }}><option value=''>--Please select--</option>{moduleInfo}</select>
            </>;
    
}
