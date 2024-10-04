import useModules from '../hooks/modules.jsx';

export default function LinkModuleChooseComponent ({curModule})  {

    const [modules, setModules] = useModules();

    const moduleInfo = modules.map(module => 
        <a style={{
            display: 'block', 
            color: 'white', 
            backgroundColor: module.code == curModule ? 'teal':'gray', 
            margin: '8px'
        }} href={`/?module=${module.code}`} key={module.id}>{module.code}</a>
    );

    return <>{moduleInfo}</>;
}
