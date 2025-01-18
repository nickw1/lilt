import React, { useState, useEffect, Fragment } from 'react';
import AdminLoginComponent from './adminlogin.jsx';
import AddExerciseComponent from './addexercise.jsx';
import AdminAnswersComponent from './adminanswers.jsx';
import AdminTopicComponent from './admintopics.jsx';
import AdminModuleComponent from './adminmodules.jsx';
import AdminAddModuleComponent from './adminaddmodule.jsx';
import useAdminLoggedIn from '../hooks/admin.jsx';
import useModules from '../hooks/modules.jsx';
import ModulesContext from '../context/modulescontext.mjs';

export default function AdminComponent() {
    const [loggedIn, setLoggedIn] = useAdminLoggedIn(false);
    const [modules, setModules] = useModules();

    return <div><h1>Admin page</h1>
        <AdminLoginComponent 
            onLoggedIn={() => setLoggedIn(true)} 
            onLoggedOut={() => setLoggedIn(false)} 
            loggedIn={loggedIn} />
        {loggedIn ? 
        <Fragment>
        <p><a href='/admin/answers'>View submitted answers</a> | 
        <a href='/'>Course notes</a></p>
        <ModulesContext.Provider value={modules}>
        <AddExerciseComponent />
        <AdminTopicComponent />
        </ModulesContext.Provider>
		<AdminModuleComponent modules={modules}/>
        <AdminAddModuleComponent onModuleAdded={module => {
			const newModules = structuredClone(modules);
			newModules.push(module);
			setModules(newModules);
		}} />
        </Fragment>
        : "" }
        </div>
}
