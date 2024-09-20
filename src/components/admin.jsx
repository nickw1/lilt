import React, { useState, useEffect, Fragment } from 'react';
import AdminLoginComponent from './adminlogin.jsx';
import AddExerciseComponent from './addexercise.jsx';
import AdminAnswersComponent from './adminanswers.jsx';
import AdminTopicComponent from './admintopics.jsx';
import AdminModuleComponent from './adminmodules.jsx';
import { Link } from 'react-router-dom';

export default function AdminComponent() {
    const [loggedIn, setLoggedIn] = useState(null);


    useEffect(() => {
        fetch('/user/admin/login')
            .then(response => response.json())
            .then(json => {
                setLoggedIn(json.loggedIn);
            })
    }, []);

    return <div><h1>Admin page</h1>
        <AdminLoginComponent onLoggedIn={() => setLoggedIn(true)} onLoggedOut={() => setLoggedIn(false)} loggedIn={loggedIn} />
        {loggedIn ? 
        <Fragment>
        <AdminAnswersComponent eid='1' />
        <AddExerciseComponent />
        <AdminTopicComponent />
        <AdminModuleComponent />
        </Fragment>
        : "" }
        </div>
}
