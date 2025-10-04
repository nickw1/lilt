"use client"

import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import { Interweave } from 'interweave';

export default function SyntaxHighlight({children, ...props}) {
    const [html, setHtml] = useState("");
    useEffect(() => {
        const lang = props.className?.includes('lang-') ? props.className.substr(5) : "";
        const html = codeToHtml(children, {
            lang,
            theme: 'vitesse-dark'
        }).then(html => setHtml(html));
    }, []);

    return <Interweave content={html} />
}

