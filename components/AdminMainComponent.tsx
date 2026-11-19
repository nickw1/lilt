"use client"

import { Fragment, useState } from 'react';

import AdminTopicComponent from './AdminTopicComponent';
import ModuleChooseComponent from './ModuleChooseComponent';
import ModulesComponent from './ModulesComponent';
//import StaticUploadComponent from './StaticUploadComponent';
import ModulesContext from '../context/module';
import EditNotesContext from '../context/editNotesEnabled';
import type { AdminMainProps, Module, Topic } from '../types';



export default function AdminMainComponent({modules, editNotesEnabled} : AdminMainProps) {

    const [moduleInfo, setModuleInfo] = useState<Partial<Module>>({
        code: "",
        topics: [] as Topic[]
    });
    const [moduleList, setModuleList] = useState<Module[]>(modules);
 
    return <Fragment>
        <p><a href='/admin/exercises'>Exercises and answers</a> | 
        <a href='/'>Course notes</a></p>
        <ModuleChooseComponent msg="Please choose a module to edit: " modules={moduleList} onModuleChosen={async(module) => {
            const response = await fetch(`/module/${module}/topics?showHidden=1`);
            const topics = await response.json();
            setModuleInfo({
                code: module,
                topics
            });
        }} />
        { moduleInfo.code ? 
        <>
        <hr />
        <h2>Module {moduleInfo.code}</h2>
        <ModulesContext.Provider value={moduleInfo}>
        <EditNotesContext.Provider value={editNotesEnabled}>
        <AdminTopicComponent />
        </EditNotesContext.Provider>
        </ModulesContext.Provider> 
        </> : "" }
        <hr /> 
        <ModulesComponent modules={moduleList} onModulesChanged={ (alteredModules: Module[])=> {
            setModuleList(alteredModules);
        }} />
        <hr />
        { editNotesEnabled && editNotesEnabled !== "0" && editNotesEnabled !== "false" && editNotesEnabled !== "no" ? "<StaticUploadComponent /> - TODO" : <p><em>File upload disabled, please set <code>EDIT_NOTES_ENABLED</code> in <code>.env</code> to <code>true</code> to enable it.</em></p> }
        </Fragment>;
}
