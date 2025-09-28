"use client"

import AdminAddModuleComponent from './AdminAddModuleComponent.jsx';
import ConfirmDeleteComponent from './ConfirmDeleteComponent.jsx';
import { useActionState, useState, useEffect } from 'react';
import { addModule, deleteModule, setModuleVisibility } from '../actions/module.mjs';

export default function ModulesComponent({modules, onModulesChanged}) {
    const [deleteState, setDeleteState] = useState({message: ""});

    return <><h2>Modules</h2>
        <ul>{ modules.map ( module => {
            const visibleModule = module.visible;
            return <li key={module.id} style={{color: visibleModule ? "black": "gray"}}>{module.code} : {module.name}<ConfirmDeleteComponent color='red' onDeleteConfirmed={async()=>{
            const result = await deleteModule(module.id);
            if(result.errors && result.errors.length > 0) {
                setDeleteState({errors: result.errors});
            } else {
                const newModules = modules.filter ( mod => module.id != mod.id );
                onModulesChanged(newModules);
            }
        }} />
        <button onClick={() => setIsVisible(module.id, !visibleModule)}>{visibleModule ? 'Hide' : 'Show'}</button>
        </li> }) }</ul>
        <AdminAddModuleComponent onModuleAdded={ module => {
            let newModules = structuredClone(modules);
            newModules.push(module);
            onModulesChanged(newModules);
        }} />
        <div style={{backgroundColor: deleteState.error ? '#ffc0c0': '#c0ffc0'}}>{deleteState.error || deleteState.message}</div>
        </>;

    async function setIsVisible(id, visible) {
        const result = await setModuleVisibility(id, visible);
        if(result.success === true) {
            let newModules = structuredClone(modules);
            const module = newModules.find(mod => mod.id == id);
            if(module) {
                module.visible = visible;
            }
            onModulesChanged(newModules);
        }
    }
}
