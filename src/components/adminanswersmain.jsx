import React, { Fragment } from 'react';
import AdminLoginComponent from './adminlogin.jsx';
import AdminExerciseManagementComponent from './adminexercisemgmt.jsx';
import useAdminLoggedIn from '../hooks/admin.jsx';

export default function AdminAnswersMain() {
    const [loggedIn, setLoggedIn] = useAdminLoggedIn(false);


    return <div><h1>Admin Exercise Management page</h1>
        <AdminLoginComponent 
            onLoggedIn={() => setLoggedIn(true)} 
            onLoggedOut={() => setLoggedIn(false)} 
            loggedIn={loggedIn} />
        {loggedIn ? 
        <Fragment>
        <p><a href='/admin'>Go to main admin page</a> |
        <a href='/'>Course notes</a></p>
        <AdminExerciseManagementComponent />
        </Fragment>
        : "" }
        </div>
}
