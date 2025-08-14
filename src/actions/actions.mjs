
"use server"
import { reload } from '@lazarv/react-server';
import db from '../../server/db/db.mjs';
import ModuleDao from '../../server/dao/module.mjs';


export function onModuleChosen(prevState, formData) {

	console.log(`onModuleChosen(): ${formData.get('moduleCode')}`);
	const dao = new ModuleDao(db);
	const moduleCode = formData.get("moduleCode");
	return moduleCode ? [dao.getModuleByCode(code)] :  dao.getAll();
//	reload();

}

