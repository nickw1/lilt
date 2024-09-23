import { useState, useEffect } from 'react';

export default function useAdminLoggedIn() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        try {
            fetch('user/admin/login')
                .then(response => response.json())
                .then(json => setLoggedIn(json.loggedIn));
        } catch(e){
            setLoggedIn(false);
        }
    }, []);        

    return [loggedIn, setLoggedIn];
}
