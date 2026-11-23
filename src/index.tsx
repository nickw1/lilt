import "../css/nwnotes.css";
import LoginComponent from '../components/LoginComponent';
import LoggedInComponent from "../components/LoggedInComponent";
import LinkModuleChooseComponent from '../components/LinkModuleChooseComponent';
import ModuleChooseComponent from '../components/ModuleChooseComponent';
import NotesHolder from '../components/NotesHolder';
import NotesComponent from '../components/NotesComponent';
import GatekeeperComponent from '../components/GatekeeperComponent';
import { getRequest } from "tinyrsc/server";
import getLoginStatus from "../misc/login";
import { getSession } from "../misc/session";

import useModules from "../hooks/modules";
import type { GatekeeperSession } from "../types";
import { ReactNode } from "react";


export default async function App() {
    const request = getRequest()!;

    const { usercode, isAdmin } = await getLoginStatus(request);
    const modules = useModules(isAdmin);

    const session = await getSession<GatekeeperSession>(request);

    const searchParams = new URL(request.url).searchParams;
    const module = searchParams.get('module') || null;


    const loginComponent = module ?
        (usercode === null ? <a href='/'>Login</a> : <LoggedInComponent usercode={usercode} />) :
        <LoginComponent
            style={{ display: module ? 'inline' : 'block' }}
            usercode={usercode} />;

    const passedGatekeeper = !process.env.GATEKEEPER || session.gatekeeper;
    const unLoggedInTitle = <><h1>lilt</h1>
        <p style={{
            fontSize: '75%',
            color: 'teal'
        }}>Lightweight Interactive Learning Tool</p></>;

    let content: ReactNode;

    if (passedGatekeeper) {

        const initTopic = parseInt(searchParams.get('topic') ?? "0");

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

        const moduleChooseComponent = <ModuleChooseComponent modules={modules}
            style={{ display: module ? 'inline' : 'block' }}
        />;

        const title = module ?
            <header id='appTitle'>
                <h1>lilt: Lightweight Interactive Learning Tool</h1>
            </header>
            :
            unLoggedInTitle;


        const modChoose = module ?
            "" : <div>{moduleChooseComponent}</div>;


        content = <div style={{ height: "100%" }}>
            <div className={module ? 'loginstuff' : 'intro'}>
                {title}
                {login}
                {modChoose}
            </div>
            {module ?
                <div className='flexContainer'>
                    <div className='sidebar'>
                        <p><strong>Modules</strong></p>
                        <LinkModuleChooseComponent modules={modules} curModule={module} />
                    </div>
                    <NotesHolder module={module} initTopic={initTopic}>
                        <NotesComponent module={module} initTopic={initTopic} />
                    </NotesHolder>
                </div> : ""}
        </div>;

    } else {
        content = <div style={{ height: "100%" }}>
            <div className='intro'>
            {unLoggedInTitle}
            <GatekeeperComponent />
            </div>
        </div>;

    }
    return (
        <html>
            <head>
                <title>LILT - Lightweight Interactive Learning Tool</title>
                <link rel='stylesheet' type='text/css' href='https://code.cdn.mozilla.net/fonts/fira.css' />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.19.1/dist/katex.min.css" integrity="sha384-WwGtaC6ywCHxA5cstpj/3+xIZvTez8dq2IcBQaXRkenHZ7FVVq1ZROtURwfbtTlG" crossOrigin="anonymous" />
            </head>
            <body>
                <div id="root">
                    {content}
                </div>
            </body>
        </html>
    )
}