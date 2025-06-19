import { Link } from '@lazarv/react-server/navigation';

export default function LinkModuleChooseComponent ({modules, curModule})  {

    const moduleInfo = modules.map(module => 
        <Link style={{
            display: 'block', 
            color: 'white', 
            backgroundColor: module.code == curModule ? 'teal':'gray', 
            margin: '8px'
        }} to={`/?module=${module.code}`} key={module.id}>{module.code}</Link>
    );

    return <>{moduleInfo}</>;
}
