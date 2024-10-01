import React, { useState, useEffect } from 'react';
import LoginComponent from './login.jsx';
import ModuleChooseComponent from './modulechoose.jsx';
import NotesComponent from './notes.jsx';
import useLoggedIn from '../hooks/login.jsx';
import { useSearchParams } from 'react-router-dom';

export default function App() {
    const [usercode, setUsercode] = useLoggedIn();
    const [searchParams, setSearchParams] = useSearchParams();
    const [module, setModule] = useState(searchParams.get('module') || '');

    const loginComponent = 
        <LoginComponent 
            style={{display: module ? 'inline' : 'block' }} 
            usercode={usercode} 
            onLoggedIn={(usercode)=>setUsercode(usercode)} 
            onLoggedOut={()=>setUsercode(null)} />;

    const moduleChooseComponent = 
        <ModuleChooseComponent 
            style={{display: module ? 'inline': 'block' }} 
            onModuleChosen={onModuleChosen} />;

    const login = module ? 
        <div style={{display: 'flex', justifyContent: 'flex-end', marginRight: '20px'}} className='logininput'>{loginComponent}</div> : 
        <div>{loginComponent}</div>;

    const modChoose = module ? 
        <>{moduleChooseComponent}</> : <div>{moduleChooseComponent}</div>;

    return <div style={{height: "100%"}}><div className={ module? 'loginstuff' : 'intro'}>
        <h1>lilt</h1>
        {login}
        {modChoose}
        </div>
        { module ?  
        <div className='notes'>
        <NotesComponent usercode={usercode} module={module} initTopic={searchParams.get('topic') || 0} />
        </div> : ""  }
        </div>;

    function onModuleChosen(code) {
        setModule(code);
    }
}
