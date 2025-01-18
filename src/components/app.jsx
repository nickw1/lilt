import React, { useState, useEffect } from 'react';
import LoginComponent from './login.jsx';
import ModuleChooseComponent from './modulechoose.jsx';
import LinkModuleChooseComponent from './modulechooselink.jsx';
import NotesComponent from './notes.jsx';
import useLoggedIn from '../hooks/login.jsx';
import useModules from '../hooks/modules.jsx';
import { useSearchParams } from 'react-router-dom';

export default function App() {
    const [usercode, setUsercode] = useLoggedIn();
    const [searchParams, setSearchParams] = useSearchParams();
    const [module, setModule] = useState(searchParams.get('module') || '');
    const [modules, setModules] = useModules();

    const loginComponent = 
        <LoginComponent 
            style={{display: module ? 'inline' : 'block' }} 
            usercode={usercode} 
            onLoggedIn={(usercode)=>setUsercode(usercode)} 
            onLoggedOut={()=>setUsercode(null)} />;

    const moduleChooseComponent = 
        <ModuleChooseComponent modules={modules}
            style={{display: module ? 'inline': 'block' }} 
            onModuleChosen={onModuleChosen} />;

    const login = module ? 
        <div style={{    
            display: 'flex', 
            justifyContent: 'flex-end', 
            marginRight: '20px'
        }} className='logininput'>{loginComponent}</div> : 
        <div>{loginComponent}</div>;

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
        <LinkModuleChooseComponent curModule={module} />
        </div>
        <div className='notes'>
        <NotesComponent usercode={usercode} module={module} initTopic={searchParams.get('topic') || 0} />
        </div></div> : ""  }
        </div>;

    function onModuleChosen(code) {
        setModule(code);
        setSearchParams(`module=${code}`);
    }
}
