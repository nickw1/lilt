import { useEffect, useState } from 'react';

export default function useModules() {
    const [modules, setModules] = useState([]);

    useEffect(() => {
        fetch('/module/all')
        .then(response => response.json())
        .then(modules => setModules(modules))
    }, []);

    return [modules, setModules];
}
