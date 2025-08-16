import { Fragment } from 'react';
import { Link } from '@lazarv/react-server/navigation';
import AdminLoginComponent from '../../../components/AdminLoginComponent.jsx';
import AdminExerciseManagementComponent from '../../../components/AdminExerciseManagementComponent.jsx';
import useLoggedIn from '../../../hooks/login.mjs';
import useModules from '../../../hooks/modules.mjs';
import ExerciseDao from '../../../../server/dao/exercise.mjs';
import db from '../../../../server/db/db.mjs';

export default function AdminExerciseManagementPage() {

    const user = useLoggedIn();
    const modules = useModules();

    const isAdmin = user.usercode !== null && user.admin;

    const exerciseDao = new ExerciseDao(db);
    const allExercises = exerciseDao.getAll();
    
    return  <div><h1>Admin exercise management page</h1>
        <AdminLoginComponent isAdmin={isAdmin} />
        {isAdmin ?  
        <Fragment>
        <p><Link to='/admin'>Go to main admin page</Link> |
        <Link to='/'>Course notes</Link></p>
        <AdminExerciseManagementComponent allExercises={allExercises} />
        </Fragment> : "" }
        </div>;
}
