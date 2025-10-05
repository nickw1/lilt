"use client"

import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import { Interweave } from 'interweave';

export default function SyntaxHighlight({children, lang}) {
    const [html, setHtml] = useState("");
//	console.log(JSON.stringify(children));
    useEffect(() => {
 //       const lang = props.className?.includes('lang-') ? props.className.substr(5) : "";
        const html = codeToHtml(children, {
            lang,
            theme: 'vitesse-dark'
        }).then(html => setHtml(html));
    }, []);

    return <Interweave content={html} />
}

