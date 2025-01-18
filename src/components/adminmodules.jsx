import React, { useContext } from 'react';
import AdminAddModuleComponent from './adminaddmodule.jsx';

export default function AdminModuleComponent({modules}) {

    const mods = modules
        .map(module => <li key={module.id}>
            {module.code} : {module.name} 
            </li>)

    return <div>
        <h2>Modules</h2>
        <ul>{mods.length > 0 ? mods: "No modules."}</ul>
        </div>;
}
