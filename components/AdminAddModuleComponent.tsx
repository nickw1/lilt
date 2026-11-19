"use client"
import { useState } from 'react';
import { addModule } from '../actions/module';
import type { AddModuleProps, AddModuleReturn } from '../types';
import Flash from './Flash'

export default function AdminAddModuleComponent({ onModuleAdded }: AddModuleProps) {

    const [status, setStatus] = useState<AddModuleReturn>({});
    return <div>
        <h3>Add Module</h3>
        Module code: <br />
        <input id='moduleCode' name='moduleCode' type='text' /><br />
        Module name: <br />
        <input id='moduleName' name='moduleName' type='text' style={{ width: "400px" }} /><br />
        <button onClick={onModuleEntered}>Go!</button>
        <Flash style={{ backgroundColor: status.error ? '#ffc0c0' : (status.warning ? '#ffffc0' : '#c0ffc0') }} msg={status.error || status.warning || (status.id ? "Successfully added module." : "") } />
        </div>

    async function onModuleEntered() {
        try {
            const code = (document.getElementById('moduleCode') as HTMLInputElement).value, name = (document.getElementById('moduleName') as HTMLInputElement).value;
            const result = await addModule(code, name);
            if (result.id) {
                onModuleAdded({ id: result.id, code, name, visible: true });
            }
            setStatus(result);
        } catch (e: any) {
            setStatus({ error: e.message });
        }
    }
}