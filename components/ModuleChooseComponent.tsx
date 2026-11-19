"use client"
import { startTransition } from 'react';
import type { ModuleChooseProps, Stylable } from '../types';


export default function ModuleChooseComponent ({modules, onModuleChosen, msg} : ModuleChooseProps & Stylable)  {


    const moduleInfo = modules.map(module => 
        <option key={module.id} value={module.code}>{module.name}</option>
    );

    return <>{msg || "Please choose a module: "}
            <select defaultValue='' onChange={e => {
                if(onModuleChosen) {
                    onModuleChosen(e.target.value);
                } else {
                    startTransition(async() => { window.location.href = `/?module=${e.target.value}` });
                }
            }}>
            <option value=''>--Please select--</option>{moduleInfo}</select>
            </>;
   
}
