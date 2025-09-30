import { loadEnvFile } from 'node:process';
import useLoggedIn from '../../hooks/login.mjs';
import useModules from '../../hooks/modules.mjs';
import AdminComponent from '../../components/AdminComponent.jsx';
import AdminLoginComponent from '../../components/AdminLoginComponent.jsx';

export default async function AdminPage() {

    const { isAdmin } = await useLoggedIn();
    const modules = useModules(true);

    loadEnvFile();

    return <div>
            <h1>Admin page</h1>
            <AdminLoginComponent isAdmin={isAdmin} />
            {isAdmin ?  <AdminComponent modules={modules} editNotesEnabled={process.env.EDIT_NOTES_ENABLED} /> : ""}
            </div>;
}
