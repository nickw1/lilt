"use client"

import { Fragment, useState } from 'react';
import { Link } from '@lazarv/react-server/navigation';
import AdminLoginComponent from './AdminLoginComponent.jsx';
import AddExerciseComponent from './AddExerciseComponent.jsx';
import AdminAnswersComponent from './AdminAnswersComponent.jsx';
import AdminTopicComponent from './AdminTopicComponent.jsx';
import AdminModuleComponent from './AdminModuleComponent.jsx';
import AdminAddModuleComponent from './AdminAddModuleComponent.jsx';
import ModulesContext from '../context/modulescontext.mjs';

export default function AdminComponent({modules}) {
    const [moduleList, setModuleList] = useState(modules);

    return <Fragment>
        <p><Link to='/admin/exercises'>Exercises and answers</Link> | 
        <Link to='/'>Course notes</Link></p>
        <ModulesContext.Provider value={moduleList}>
        <AddExerciseComponent />
        <AdminTopicComponent />
        <AdminModuleComponent />
        <AdminAddModuleComponent onModuleAdded={module => {
            const newModules = structuredClone(moduleList);
            newModules.push(module);
            setModuleList(newModules);
        }} />
        </ModulesContext.Provider>
        </Fragment>;
}
