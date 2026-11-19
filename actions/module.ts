"use server"

import { getRequest } from 'tinyrsc/server';
import ModuleDao from '../dao/module.mjs';
import Controller from '../controllers/controller';
import db from '../db/';
import useLoggedIn from '../misc/login';
import xss from 'xss';
import fs from 'node:fs/promises';
import type { AddModuleReturn, DeleteModuleReturn } from '../types';

export async function addModule(code: string, name: string): Promise<AddModuleReturn> {
    const request = getRequest()!;
    const { isAdmin } = await useLoggedIn(request);
    if (!isAdmin) {
        return { error: "Only admins can add a module." };
    }
    if (code && name && code.match("^\\w+$")) {
        const moduleDao = new ModuleDao(db);
        const id = moduleDao.addModule(xss(code), xss(name));
        let warning = "";
        try {
            await fs.mkdir(`${process.env.RESOURCES}/${code}`);
        } catch (e: any) {
            if (e.code == "EEXIST") {
                warning = "Not creating directory for module as it already exists.";
            } else {
                return { error: e.message };
            }
        }
        return {
            id,
            warning: warning
        };
    } else {
        return { error: "Name and/or code missing and/or invalid format for module code." };
    }
}

export async function setModuleVisibility(id: number, isVisible: boolean) {
    const request = getRequest()!;
    const { isAdmin } = await useLoggedIn(request);
    if (!isAdmin) {
        return { "error": "Only admins can change module visibility." };
    }
    const moduleDao = new ModuleDao(db);
    if (!moduleDao.setModuleVisibility(id, isVisible)) {
        return { "error": "Cannot find module with that ID." };
    }
    return { success: true };
}

export async function deleteModule(id: number): Promise<DeleteModuleReturn> {
    const request = getRequest()!;
    const { isAdmin } = await useLoggedIn(request);
    if (!isAdmin) {
        return { "errors": ["Only admins can delete a module."] };
    }
    const controller = new Controller(db);
    const module = controller.moduleDao.getModuleById(id);
    const result = controller.deleteModule(id);
    if (result.errors && result.errors.length > 0) {
        return result;
    } else {
        try {
            await fs.rmdir(`${process.env.RESOURCES}/${module.code}`);
            return result;
        } catch (e: any) {
            if (e.code == "ENOENT") {
                return { warning: "Not deleting directory for module as it doesn't exist.", ...result };
            } else {
                return { errors: [e.message] };
            }
        }
    }
}
