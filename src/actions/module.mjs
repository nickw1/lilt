"use server"

import ModuleDao from '../../server/dao/module.mjs';
import db from '../../server/db/db.mjs';
import xss from 'xss';

export function addModule(prevState, formData) {
    const code = formData.get("moduleCode"), name = formData.get("moduleName");
    if(code && name) {
        const moduleDao = new ModuleDao(db);
        const id = moduleDao.addModule(xss(code), xss(name));
        const newState = structuredClone(prevState);
        newState.push({id, code, name});
        return newState;
    }
    return prevState;
}
