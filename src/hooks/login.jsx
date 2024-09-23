import { useState, useEffect } from 'react';

export default function useLoggedIn() {
    const [usercode, setUsercode] = useState(null);

    useEffect(() => {
        try {
            fetch('/user/login')
                .then(response => response.json())
                .then(json => setUsercode(json.usercode));
        } catch(e){
            setUsercode(null);
        }
    }, []);        

    return [usercode, setUsercode];
}
