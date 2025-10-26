import React from 'react';
import LoginComponent from '../components/LoginComponent.jsx';
import LoggedInComponent from '../components/LoggedInComponent.jsx';
import ModuleChooseComponent from '../components/ModuleChooseComponent.jsx';
import LinkModuleChooseComponent from '../components/LinkModuleChooseComponent.jsx';
import NotesHolder from '../components/NotesHolder.jsx';
import NotesComponent from '../components/NotesComponent.jsx';
import { useSearchParams } from '@lazarv/react-server';

import UserDao from '../dao/user.mjs';
import { Link } from '@lazarv/react-server/navigation';

import ModuleDao from '../dao/module.mjs';
import db from '../db/db.mjs';

import useLoggedIn from '../hooks/login.mjs';
import useModules from '../hooks/modules.mjs';

export default async function App() {
    const searchParams = useSearchParams();
    const module = searchParams.module || '';
    const { usercode, isAdmin } = await useLoggedIn();

    const modules = useModules(isAdmin);

    const initTopic = searchParams.topic || 0;

    const loginComponent = module ? 
        (usercode === null ? <Link to='/'>Login</Link> : <LoggedInComponent usercode={usercode}/>) : 
        <LoginComponent 
            style={{display: module ? 'inline' : 'block' }} 
            usercode={usercode}  />



    const moduleChooseComponent =  <ModuleChooseComponent modules={modules} 
            style={{display: module ? 'inline': 'block' }} 
             />; 

    const login = module ? 
        <div style={{    
            display: 'flex', 
            justifyContent: 'right', 
            marginRight: '20px'
        }} className='logininput'>
        {loginComponent}
        </div> :
        <div>
        {loginComponent}
        </div>;

    const modChoose = module ? 
        "" : <div>{moduleChooseComponent}</div>;

    const title = module ? 
        <header id='appTitle'>
        <h1>lilt: Lightweight Interactive Learning Tool</h1>
        </header> 
        : 
        <>
        <h1>lilt</h1>
        <p style={{
            fontSize: '75%', 
            color: 'teal'
        }}>Lightweight Interactive Learning Tool</p>
        </>;

    return <div style={{height: "100%"}}><div className={ module? 'loginstuff' : 'intro'}>
        {title}
        {login}
        {modChoose}
        </div>
        { module ?  
        <div className='flexContainer'>
        <div className='sidebar'>
        <p><strong>Modules</strong></p>
        <LinkModuleChooseComponent modules={modules} curModule={module} />
        </div>
        <NotesHolder module={module} topic={initTopic}>
        <NotesComponent module={module} initTopic={initTopic} />
        </NotesHolder></div> : ""  }
        </div>;

}
