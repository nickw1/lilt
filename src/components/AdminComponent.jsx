//"use client"

import { Fragment } from 'react';
import { Link } from '@lazarv/react-server/navigation';
import AdminLoginComponent from './AdminLoginComponent.jsx';
import AddExerciseComponent from './AddExerciseComponent.jsx';
import AdminAnswersComponent from './AdminAnswersComponent.jsx';
import AdminTopicComponent0 from './AdminTopicComponent0.jsx';
import AdminModuleComponent from './AdminModuleComponent.jsx';
import AdminAddModuleComponent from './AdminAddModuleComponent.jsx';
//import ModulesContext from '../context/modulescontext.mjs';
import useModules from '../hooks/modules.mjs';

export default function AdminComponent({modules}) {
//    const [moduleList, setModuleList] = useState(modules);
	const moduleList = useModules();

    return <Fragment>
        <p><Link to='/admin/exercises'>Exercises and answers</Link> | 
        <Link to='/'>Course notes</Link></p>
        <AddExerciseComponent />
        <AdminTopicComponent0 />
        <AdminModuleComponent />
        </Fragment>;
}
/*
    return <Fragment>
        <p><Link to='/admin/exercises'>Exercises and answers</Link> | 
        <Link to='/'>Course notes</Link></p>
        <ModulesContext.Provider value={moduleList}>
        <AddExerciseComponent />
        <AdminTopicComponent0 />
        <AdminAddModuleComponent onModuleAdded={module => {
            const newModules = structuredClone(moduleList);
            newModules.push(module);
            setModuleList(newModules);
        }} />
        </ModulesContext.Provider>
        </Fragment>;
*/
