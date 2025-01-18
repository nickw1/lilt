import React from 'react';

export default function ModuleChooseComponent ({modules, onModuleChosen})  {


    const moduleInfo = modules.map(module => 
        <option key={module.id} value={module.code}>{module.name}</option>
    );

    return <>Please choose a module:
            <select onChange={e=>{
            onModuleChosen(e.target.value);
        }}><option value=''>--Please select--</option>{moduleInfo}</select>
            </>;
    
}
