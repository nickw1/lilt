import { Fragment } from 'react';
import { Link } from '@lazarv/react-server/navigation';
import AdminLoginComponent from '../../../components/AdminLoginComponent.jsx';
import AdminExerciseManagementComponent from '../../../components/AdminExerciseManagementComponent.jsx';
import useLoggedIn from '../../../hooks/login.jsx';
import useModules from '../../../hooks/modules.jsx';

export default function AdminAnswersPage() {

    const user = useLoggedIn();
    const modules = useModules();

    const isAdmin = user.usercode && user.admin;
    
    return  <div><h1>Admin exercise management page</h1>
        <AdminLoginComponent isAdmin={isAdmin} />
        {isAdmin ?  
        <Fragment>
        <p><Link to='/admin'>Go to main admin page</Link> |
        <Link to='/'>Course notes</Link></p>
        <AdminExerciseManagementComponent />
        </Fragment> : "" }
        </div>;
}
