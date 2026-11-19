"use client"

import AdminAddModuleComponent from './AdminAddModuleComponent';
import ConfirmDeleteComponent from './ConfirmDeleteComponent';
import Flash from './Flash';
import { useState } from 'react';
import { deleteModule, setModuleVisibility } from '../actions/module';
import type { ModulesComponentProps, Module, DeleteModuleReturn } from '../types';

export default function ModulesComponent({ modules, onModulesChanged }: ModulesComponentProps) {
    const [deleteState, setDeleteState] = useState<DeleteModuleReturn & { message: string }>({ errors: [], warning: "", message: "" });

    return <><h2>Modules</h2>
        <ul>{modules.map((module: Module) => {
            const visibleModule = module.visible;
            return <li key={module.id} style={{ color: visibleModule ? "black" : "gray" }}>{module.code} : {module.name}<ConfirmDeleteComponent color='red' onDeleteConfirmed={async () => {
                const result: DeleteModuleReturn = await deleteModule(module.id);
                if (result.errors && result.errors.length > 0) {
                    setDeleteState({ errors: result.errors, message: "" });
                } else if (result.warning) {
                    setDeleteState({ errors: [], warning: result.warning, message: "" });
                } else {
                    const newModules = modules.filter(mod => module.id != mod.id);
                    onModulesChanged(newModules);
                    setDeleteState({ errors: [], message: "Successfully deleted." });
                }
            }} />
                <button onClick={() => setIsVisible(module.id, !visibleModule)}>{visibleModule ? 'Hide' : 'Show'}</button>
            </li>
        })}</ul>
        <AdminAddModuleComponent onModuleAdded={(module: Module) => {
            let newModules = structuredClone(modules);
            newModules.push(module);
            onModulesChanged(newModules);
        }} />
        <Flash style={{ backgroundColor: deleteState.errors.length > 0 ? '#ffc0c0' : (deleteState.warning ? '#e0c0c0' : '#c0ffc0') }} msg={deleteState.errors.join("<br />") || deleteState.warning || deleteState.message} />
    </>;

    async function setIsVisible(id: number, visible: boolean) {
        const result = await setModuleVisibility(id, visible);
        if (result.success === true) {
            let newModules = structuredClone(modules);
            const module = newModules.find(mod => mod.id == id);
            if (module) {
                module.visible = visible;
            }
            onModulesChanged(newModules);
        }
    }
}
