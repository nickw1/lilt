import useLoggedIn from '../../hooks/login.jsx';
import useModules from '../../hooks/modules.jsx';
import AdminComponent from '../../components/AdminComponent.jsx';
import AdminLoginComponent from '../../components/AdminLoginComponent.jsx';


export default function AdminPage() {

    const user = useLoggedIn();
    const modules = useModules();

    const isAdmin = user.usercode && user.admin;
    
    return  <div><h1>Admin page</h1>
        <AdminLoginComponent isAdmin={isAdmin} />
        {isAdmin ?  <AdminComponent modules={modules} /> : ""}
        </div>;
}
