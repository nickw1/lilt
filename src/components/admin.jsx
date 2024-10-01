import React, { useState, useEffect, Fragment } from 'react';
import AdminLoginComponent from './adminlogin.jsx';
import AddExerciseComponent from './addexercise.jsx';
import AdminAnswersComponent from './adminanswers.jsx';
import AdminTopicComponent from './admintopics.jsx';
import AdminModuleComponent from './adminmodules.jsx';
import useAdminLoggedIn from '../hooks/admin.jsx';

export default function AdminComponent() {
    const [loggedIn, setLoggedIn] = useAdminLoggedIn(false);


    return <div><h1>Admin page</h1>
        <AdminLoginComponent 
            onLoggedIn={() => setLoggedIn(true)} 
            onLoggedOut={() => setLoggedIn(false)} 
            loggedIn={loggedIn} />
        {loggedIn ? 
        <Fragment>
        <p><a href='/admin/answers'>View submitted answers</a></p>
        <AddExerciseComponent />
        <AdminTopicComponent />
        <AdminModuleComponent />
        </Fragment>
        : "" }
        </div>
}
