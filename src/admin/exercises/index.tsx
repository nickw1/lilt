import '../../../css/nwnotes.css';
import { Fragment } from 'react';
import AdminLoginComponent from '../../../components/AdminLoginComponent';
import AdminExerciseManagementComponent from '../../../components/AdminExerciseManagementComponent';
import useLoggedIn from '../../../misc/login';
import ExerciseDao from '../../../dao/exercise.mjs';
import TopicDao from '../../../dao/topic.mjs';
import db from '../../../db';
import { getRequest } from 'tinyrsc/server';
import { Exercise } from '../../../types';

export default async function AdminExerciseManagementPage() {

    const request = getRequest()!;
    const user = await useLoggedIn(request);

    const isAdmin = user.usercode !== null && user.isAdmin;

    const exerciseDao = new ExerciseDao(db);
    const topicDao = new TopicDao(db);
    const allExercises = exerciseDao.getAll();
    allExercises.forEach((ex: Exercise) => {
        const topic = topicDao.getTopicById(ex.topic);
        ex.topicNumber = topic.number;
    });

    return (
        <html>
            <head>
                <title>LILT - Lightweight Interactive Learning Tool</title>
                <link rel='stylesheet' type='text/css' href='https://code.cdn.mozilla.net/fonts/fira.css' />
            </head>
            <body>
                <div id="root">
                    <div><h1>Admin exercise management page</h1>
                        {isAdmin ?
                            <Fragment>
                                <p><a href='/admin'>Go to main admin page</a> |
                                    <a href='/'>Course notes</a></p>
                                <AdminExerciseManagementComponent allExercises={allExercises} />
                            </Fragment> : <AdminLoginComponent />}
                    </div>
                </div>
            </body>
        </html>
    );

}
