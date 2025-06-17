
import React from 'react';
import LoginComponent from '../components/LoginComponent.jsx';
import { useSearchParams, useHttpContext } from '@lazarv/react-server';

import UserDao from '../../server/dao/user.mjs';
import db from '../../server/db/db.mjs';
import '../../css/fira.css';
import "../../css/nwnotes.css";

export default function App() {
//    const [usercode, setUsercode] = useLoggedIn();
    const searchParams = useSearchParams();
    const module = searchParams.module || '';
    //const [modules, setModules] = useModules();

    const userDao = new UserDao(db);
    let usercode = null;

    const {
        platform: { request: req }
    } = useHttpContext();

    if(req.session?.uid) {
        usercode = userDao.findUserById(req.session.uid)?.usercode;
    }

    const loginComponent = 
        <LoginComponent 
            style={{display: module ? 'inline' : 'block' }} 
            usercode={usercode}  />

    const moduleChooseComponent =  <div></div>;
   //     <ModuleChooseComponent modules={modules}
    //        style={{display: module ? 'inline': 'block' }} 
     //       onModuleChosen={onModuleChosen} />; 

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
 //       <LinkModuleChooseComponent curModule={module} />
        </div>
        <div className='notes'>
  //      <NotesComponent usercode={usercode} module={module} initTopic={searchParams.topic || 0} />
        </div></div> : ""  }
        </div>;

    function onModuleChosen(code) {
        setModule(code);
        setSearchParams(`module=${code}`);
    }
}
