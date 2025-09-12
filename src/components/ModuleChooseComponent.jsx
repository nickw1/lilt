"use client"
import React, { startTransition } from 'react';
import { useClient } from '@lazarv/react-server/client';

export default function ModuleChooseComponent ({modules, onModuleChosen})  {

    const { navigate } = useClient();

    const moduleInfo = modules.map(module => 
        <option key={module.id} value={module.code}>{module.name}</option>
    );

    return <>Please choose a module to edit:
            <select defaultValue='' onChange={e => {
                if(onModuleChosen) {
                    onModuleChosen(e.target.value);
                } else {
                    startTransition(async() => { navigate(`/?module=${e.target.value}`) });
                }
            }}>
            <option value=''>--Please select--</option>{moduleInfo}</select>
            </>;
   
}
