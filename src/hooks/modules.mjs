import { cache } from 'react';
import db from '../db/db.mjs';
import ModuleDao from '../dao/module.mjs';

const moduleDao = new ModuleDao(db);
const cachedGetAllModules = cache(moduleDao.getAll.bind(moduleDao, true));
const cachedGetAllVisibleModules = cache(moduleDao.getAll.bind(moduleDao, false));

export default function useModules(showHidden = false) {
    return showHidden ? cachedGetAllModules() : cachedGetAllVisibleModules();
     
}
