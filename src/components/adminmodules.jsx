import React, { useEffect, useState } from 'react';
import AdminAddModuleComponent from './adminaddmodule.jsx';

export default function AdminModuleComponent() {

    const [modules, setModules] = useState({});

    useEffect(() => {
        fetch('/module/all')
            .then(response => response.json())
            .then(json => {
                const modulesMap = {};
                for(let module of json) {
                    modulesMap[module.id] = module;
                }
                setModules(modulesMap);
            }); 
    }, []);

    const mods = Object.keys(modules)
        .map(moduleId => <li key={moduleId}>
            { modules[moduleId].code} : {modules[moduleId].name} 
            </li>)

    return <div>
        <h2>Modules</h2>
        <ul>{mods.length > 0 ? mods: "No modules."}</ul>
        <AdminAddModuleComponent onModuleAdded={(module)=> {
            const newModules = structuredClone(modules);
            newModules[module.id] = module;
            setModules(newModules);
        } } />
        </div>;
}
