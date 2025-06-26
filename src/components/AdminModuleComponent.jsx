"use client"

import React, { useContext } from 'react';
import AdminAddModuleComponent from './AdminAddModuleComponent.jsx';
import ModulesContext from '../context/modulescontext.mjs';

export default function AdminModuleComponent() {

	const modules = useContext(ModulesContext);

    const mods = modules
        .map(module => <li key={module.id}>
            {module.code} : {module.name} 
            </li>)

    return <div>
        <h2>Modules</h2>
        <ul>{mods.length > 0 ? mods: "No modules."}</ul>
        </div>;
}
