import useLoggedIn from '../../hooks/login.mjs';
import useModules from '../../hooks/modules.mjs';
import AdminComponent from '../../components/AdminComponent.jsx';
import AdminLoginComponent from '../../components/AdminLoginComponent.jsx';


export default function AdminPage() {

    const user = useLoggedIn();
    const isAdmin = user.admin;
    const modules = useModules();

    return  <div><h1>Admin page</h1>
        <AdminLoginComponent isAdmin={isAdmin} />
        {isAdmin ?  <AdminComponent modules={modules} /> : ""}
        </div>;
}
