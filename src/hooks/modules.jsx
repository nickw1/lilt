import { cache } from 'react';
import db from '../../server/db/db.mjs';
import ModuleDao from '../../server/dao/module.mjs';

const moduleDao = new ModuleDao(db);
console.log('Setting up modules cache');
const cachedGetAllModules = cache(moduleDao.getAll.bind(moduleDao));

export default function useModules() {
    return cachedGetAllModules();
}
