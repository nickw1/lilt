
import { logout } from '../actions/user.mjs';

export default function Logout({onLoggedOut}) {

	return <form action={logout}>
		<input type="submit" value="Logout!" />
		</form>;	
}
