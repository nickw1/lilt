"use client"

import { Fragment, useState } from 'react';
import { Link } from '@lazarv/react-server/navigation';
import AdminLoginComponent from './AdminLoginComponent.jsx';
import AdminTopicComponent from './AdminTopicComponent.jsx';
import AdminAddModuleComponent from './AdminAddModuleComponent.jsx';
import ModuleChooseComponent from './ModuleChooseComponent.jsx';
import ModulesComponent from './ModulesComponent.jsx';
import StaticUploadComponent from './StaticUploadComponent.jsx';
import ModulesContext from '../context/module.mjs';
import EditNotesContext from '../context/editNotesEnabled.mjs';
import { getTopics } from '../actions/topic.mjs';


export default function AdminComponent({modules, editNotesEnabled}) {

    const [moduleInfo, setModuleInfo] = useState({
        moduleCode: "",
        topics: []
    });
    const [moduleList, setModuleList] = useState(modules);
 
    return <Fragment>
        <p><Link to='/admin/exercises'>Exercises and answers</Link> | 
        <Link to='/'>Course notes</Link></p>
        <ModuleChooseComponent msg="Please choose a module to edit: " modules={moduleList} onModuleChosen={async(module) => {
            const topics = await getTopics(module, true);
            setModuleInfo({
                moduleCode: module,
                topics
            });
        }} />
        { moduleInfo.moduleCode ? 
        <>
        <hr />
        <h2>Module {moduleInfo.moduleCode}</h2>
        <ModulesContext.Provider value={moduleInfo}>
        <EditNotesContext.Provider value={editNotesEnabled}>
        <AdminTopicComponent />
        </EditNotesContext.Provider>
        </ModulesContext.Provider> 
        </> : "" }
        <hr /> 
        <ModulesComponent modules={moduleList} onModulesChanged={ alteredModules => {
            setModuleList(alteredModules);
        }} />
        <hr />
        <StaticUploadComponent />
        </Fragment>;
}
