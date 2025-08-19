"use client"

import { Fragment, useState } from 'react';
import { Link } from '@lazarv/react-server/navigation';
import AdminLoginComponent from './AdminLoginComponent.jsx';
import AddExerciseComponent from './AddExerciseComponent.jsx';
import AdminTopicComponent from './AdminTopicComponent.jsx';
import AdminAddModuleComponent from './AdminAddModuleComponent.jsx';
import ModuleChooseComponent from './ModuleChooseComponent.jsx';
import ModulesComponent from './ModulesComponent.jsx';
import ModulesContext from '../context/module.mjs';
import { getTopics } from '../actions/topic.mjs';

export default function AdminComponent({modules}) {

    const [moduleInfo, setModuleInfo] = useState({
        moduleCode: "",
        topics: []
    });
    return <Fragment>
        <p><Link to='/admin/exercises'>Exercises and answers</Link> | 
        <Link to='/'>Course notes</Link></p>
        <ModuleChooseComponent modules={modules} onModuleChosen={async(module) => {
            const topics = await getTopics(module);
            setModuleInfo({
                moduleCode: module,
                topics
            });
        }} />
        <ModulesContext.Provider value={moduleInfo}>
        <AddExerciseComponent />
        <AdminTopicComponent />
        </ModulesContext.Provider>
 
        <ModulesComponent modules={modules} />
        </Fragment>;
}
