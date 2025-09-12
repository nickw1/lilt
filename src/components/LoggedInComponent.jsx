import { logout } from '../actions/user.mjs';

export default function LoggedInComponent({usercode}) {
    return <form action={logout} key='formLogout'>Your user code: <strong>{usercode === 0 ? "admin": usercode}</strong>
    <input type='submit' value='Logout' />
    </form>
}
