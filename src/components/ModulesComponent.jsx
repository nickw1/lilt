import AdminAddModuleComponent from './AdminAddModuleComponent.jsx';
import ConfirmDeleteComponent from './ConfirmDeleteComponent.jsx';
import { useActionState, useState } from 'react';
import { addModule, deleteModule } from '../actions/module.mjs';
export default function ModulesComponent({modules}) {

    const [modulesState, addModuleWithState] = useActionState(addModule, { error: "", modules });
    const [deleteState, setDeleteState] = useState({message: ""});
    const [deletedModules, setDeletedModules] = useState([]);
    return <><h2>Modules</h2>
        <ul>{ modulesState.modules.map ( module => deletedModules.indexOf(module.id) != -1 ? "" : <li key={module.id}>{module.code} : {module.name}

        <ConfirmDeleteComponent color='red' onDeleteConfirmed={async()=>{
            const result = await deleteModule(module.id);
            if(result.errors && result.errors.length > 0) {
                setDeleteState({errors: result.errors});
            } else {
                const newDeletedModules = structuredClone(deletedModules);
                newDeletedModules.push(module.id);
                setDeletedModules(newDeletedModules);
            }
        }} /></li> ) }</ul>
        <div style={{backgroundColor: deleteState.errors ? '#ffc0c0': '#c0ffc0'}}>{deleteState.errors ? <ul>{deleteState.errors.map(error => <li>{error}</li>)}</ul> : deleteState.message || ""}</div>
        <AdminAddModuleComponent onModuleSubmitted={addModuleWithState} />
        <div style={{backgroundColor: modulesState.error ? '#ffc0c0': (modulesState.warning ? '#c0c0ff' : '#c0ffc0')}}>{modulesState.error || modulesState.warning || ""}</div>
        </>;
}
