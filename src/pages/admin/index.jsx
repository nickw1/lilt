import useLoggedIn from '../../hooks/login.mjs';
import useModules from '../../hooks/modules.mjs';
import AdminComponent from '../../components/AdminComponent.jsx';
import AdminLoginComponent from '../../components/AdminLoginComponent.jsx';
import '../../../server/misc/dotenv.mjs';


export default async function AdminPage() {

//    const { isAdmin } = await useLoggedIn();
    const s = await useLoggedIn();
	console.log(s);
    console.log(`isAdmin ${s.isAdmin}`);
    const modules = useModules();

    return  <div><h1>Admin page</h1>
        <AdminLoginComponent isAdmin={s.isAdmin} />
        {s.isAdmin ?  <AdminComponent modules={modules} /> : ""}
        </div>;
}
