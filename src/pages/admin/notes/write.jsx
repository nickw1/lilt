import fs from 'node:fs/promises';
import { useSearchParams } from '@lazarv/react-server';
import { Link } from '@lazarv/react-server/navigation';
import useLoggedIn from '../../../hooks/login.mjs';
import useModules from '../../../hooks/modules.mjs';
import WriteNotesComponent from '../../../components/WriteNotesComponent.jsx';
import AdminLoginComponent from '../../../components/AdminLoginComponent.jsx';
import { loadEnvFile } from 'node:process';

export default async function WriteNotesPage() {

    const searchParams = useSearchParams();
    const { isAdmin } = await useLoggedIn();

    loadEnvFile();
 
    if(isAdmin) {
        const { module, topicNum } = searchParams;
        let content = "";
        if(module && topicNum && topicNum.match("^\\d+$") && module.match("^\\w+$")) {
            try {
                const notes = (await fs.readFile(`${process.env.RESOURCES}/${module}/${topicNum}.md`)).toString();
                 content = <WriteNotesComponent 
                    notes={notes}
                    module={searchParams.module}
                    topicNum={searchParams.topicNum} />;
            } catch(e) {
                content = e.code == "ENOENT" ? `Cannot find notes for ${module}, topic ${topicNum}.` : `Error: code ${e.code}`;
            }
        } else {
            content = <div>Module and topic number missing or in an invalid format.</div>;
        }
        return <div>{content}<br /><Link to='/admin'>Back to admin page</Link></div>;
    } else {
        return <div>Only admins can access this page. <Link to='/admin'>Login as an admin</Link></div>;
    }
}
