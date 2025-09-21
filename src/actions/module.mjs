"use server"

import ModuleDao from '../dao/module.mjs';
import Controller from '../controllers/controller.mjs';
import db from '../db/db.mjs';
import useLoggedIn from '../hooks/login.mjs';
import xss from 'xss';
import fs from 'node:fs/promises';

export async function addModule(prevState, formData) {
    const { isAdmin } = await useLoggedIn();
    if(!isAdmin) {
        return {"error" : "Only admins can add a module."};
    }
    const code = formData.get("moduleCode"), name = formData.get("moduleName");
    if(code && name && code.match("^\\w+$")) {
        const moduleDao = new ModuleDao(db);
        const id = moduleDao.addModule(xss(code), xss(name));
        let warning = "";
        try {
            await fs.mkdir(`${process.env.RESOURCES}/${code}`);
        } catch (e) {
            if(e.code == "EEXIST") {
                warning = "Not creating directory for module as it already exists.";
            } else {
                console.error(e);
            }
        }
        const newState = structuredClone(prevState);
        newState.push({id, code, name, warning});
        return newState;
    } else {
        console.error("Server function addModule(): Name and code missing and/or invalid format for module code.");
    }
        
    return prevState;
}

export async function deleteModule(id) {
    const { isAdmin } = await useLoggedIn();
    if(!isAdmin) {
        return {"error" : "Only admins can delete a module."};
    }
    const controller = new Controller(db);
    const module = controller.moduleDao.getModuleById(id);
    const result = controller.deleteModule(id);
    if(result.errors && result.errors.length > 0) {
        return result;
    } else {
        try {
            await fs.rmdir(`${process.env.RESOURCES}/${module.code}`);
            return result;
        } catch (e) {
            if(e.code == "ENOENT") {
                return  { warning : "Not deleting directory for module as it doesn't exist.", ...result };
            } else {
               return { errors: [e.message] };
            }
        }
    }
}
