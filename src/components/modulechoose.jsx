import React from 'react';
import useModules from '../hooks/modules.jsx';

export default function ModuleChooseComponent ({onModuleChosen})  {

    const [modules, setModules] = useModules();

    const moduleInfo = modules.map(module => 
        <option key={module.id} value={module.code}>{module.name}</option>
    );

    return <>Please choose a module:
            <select onChange={e=>{
            onModuleChosen(e.target.value);
        }}><option value=''>--Please select--</option>{moduleInfo}</select>
            </>;
    
}
