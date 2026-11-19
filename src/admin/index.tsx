
import '../../css/nwnotes.css';
import { getRequest } from 'tinyrsc/server';
import AdminComponent from '../../components/AdminComponent';
import getLoginStatus from '../../misc/login';
import useModules from '../../hooks/modules';



export default async function AdminPage() {

  const request = getRequest()!;
  const modules = useModules(true);

  const { isAdmin } = await getLoginStatus(request);

  //loadEnvFile();

  return (
    <html>
      <head>
        <title>LILT - Lightweight Interactive Learning Tool</title>
        <link rel='stylesheet' type='text/css' href='https://code.cdn.mozilla.net/fonts/fira.css' />
      </head>
      <body>
        <div id="root">
          <h1>Admin page</h1>
          <AdminComponent isAdmin={isAdmin} modules={modules} />
        </div>
      </body>
    </html>
  );
}