"use client"

import AdminAddModuleComponent from './AdminAddModuleComponent.jsx';
import ConfirmDeleteComponent from './ConfirmDeleteComponent.jsx';
import { useActionState, useState, useEffect } from 'react';
import { addModule, deleteModule, setModuleVisibility } from '../actions/module.mjs';

export default function ModulesComponent({modules}) {

    const [modulesState, addModuleWithState] = useActionState(addModule, { error: "", modules });
    const [deleteState, setDeleteState] = useState({message: ""});
    const [deletedModules, setDeletedModules] = useState([]);
    const [hiddenModules, setHiddenModules] = useState([]);

    useEffect(() => {
        setHiddenModules(
            modules.filter(mod => !mod.visible).map(mod => mod.id)
        );
    }, [modules]);

    return <><h2>Modules</h2>
        <ul>{ modulesState.modules.map ( module => {
            const visibleModule = hiddenModules.indexOf(module.id) == -1;
            return deletedModules.indexOf(module.id) != -1 ? "" : <li key={module.id} style={{color: visibleModule ? "black": "gray"}}>{module.code} : {module.name}<ConfirmDeleteComponent color='red' onDeleteConfirmed={async()=>{
            const result = await deleteModule(module.id);
            if(result.errors && result.errors.length > 0) {
                setDeleteState({errors: result.errors});
            } else {
                const newDeletedModules = structuredClone(deletedModules);
                newDeletedModules.push(module.id);
                setDeletedModules(newDeletedModules);
            }
        }} />
        <button onClick={() => setIsVisible(module.id, !visibleModule)}>{visibleModule ? 'Hide' : 'Show'}</button>
        </li> }) }</ul>
        <AdminAddModuleComponent onModuleSubmitted={addModuleWithState} />
        <div style={{backgroundColor: modulesState.error ? '#ffc0c0': (modulesState.warning ? '#ffffc0' : '#c0ffc0') }}>{modulesState.error || modulesState.warning || modulesState.success}</div>
        </>;

    async function setIsVisible(id, visible) {
        const result = await setModuleVisibility(id, visible);
        if(result.success === true) {
            let newHiddenModules = structuredClone(hiddenModules);
            if(visible) {
                const idx = hiddenModules.indexOf(id);
                newHiddenModules.splice(idx, 1);
            } else {
                newHiddenModules.push(id);
            }
            setHiddenModules(newHiddenModules);
        }
    }
}
