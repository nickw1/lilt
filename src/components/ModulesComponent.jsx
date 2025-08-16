import AdminAddModuleComponent from './AdminAddModuleComponent.jsx';
import { useActionState } from 'react';
import { addModule } from '../actions/module.mjs';
export default function ModulesComponent({modules}) {

    const [modulesState, addModuleWithState] = useActionState(addModule, modules);
    return <><h2>Modules</h2>
        <ul>{ modulesState.map ( module => <li key={module.id}>{module.code} : {module.name}</li> ) }</ul>
        <AdminAddModuleComponent onModuleSubmitted={addModuleWithState} />
        </>;
}
