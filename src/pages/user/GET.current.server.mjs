import useLoggedIn from '../../hooks/login.mjs';

export default async function getLogin(context) {
	const { uid } = await useLoggedIn();
	return  new Response(
	    JSON.stringify({loggedIn: uid !== undefined ? true: false, uid}),
		    {headers: { "Content-Type": "application/json" }}
	    );
}
