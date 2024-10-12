import React, { useState, useEffect, Fragment } from 'react';
import AdminLoginComponent from './adminlogin.jsx';
import AddExerciseComponent from './addexercise.jsx';
import AdminAnswersComponent from './adminanswers.jsx';
import AdminTopicComponent from './admintopics.jsx';
import AdminModuleComponent from './adminmodules.jsx';
import useAdminLoggedIn from '../hooks/admin.jsx';

export default function AdminAnswersMain() {
    const [loggedIn, setLoggedIn] = useAdminLoggedIn(false);


    return <div><h1>Admin Answers page</h1>
        <AdminLoginComponent 
            onLoggedIn={() => setLoggedIn(true)} 
            onLoggedOut={() => setLoggedIn(false)} 
            loggedIn={loggedIn} />
        {loggedIn ? 
        <Fragment>
        <p><a href='/admin'>Go to main admin page</a> |
        <a href='/'>Course notes</a></p>
        <AdminAnswersComponent eid='1' />
        </Fragment>
        : "" }
        </div>
}
