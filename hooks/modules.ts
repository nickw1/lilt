import { cache } from 'react';
import db from '../db';
import ModuleDao from '../dao/module.mjs';
import type { Module } from '../types';

const moduleDao = new ModuleDao(db);
const cachedGetAllModules = cache(moduleDao.getAll.bind(moduleDao, true));
const cachedGetAllVisibleModules = cache(moduleDao.getAll.bind(moduleDao, false));

export default function useModules(showHidden = false) : Module[] {
    return showHidden ? cachedGetAllModules() : cachedGetAllVisibleModules();
     
}