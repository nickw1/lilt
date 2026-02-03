"use client"

import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import { Interweave } from 'interweave';

export default function SyntaxHighlight({children, lang}) {
    const [html, setHtml] = useState("");
    // <script> tags in Markdown code blocks cause problems with rendering
    // They need to be entity-encoded (&lt; and &gt;) in the code blocks.
    // Then we unencode them here, then codeToHtml() encodes them again
    const unencodedChildren = children.replaceAll(/&lt;script(.*)&gt;(.*)&lt;\/script&gt;/g,`<script$1>$2</script>`);
    useEffect(() => {
 //       const lang = props.className?.includes('lang-') ? props.className.substr(5) : "";
        const html = codeToHtml(unencodedChildren, {
            lang,
            theme: 'vitesse-dark'
        }).then(html => setHtmlWithUnescape(html));
    }, []);

    return <Interweave content={html} />

    function setHtmlWithUnescape(html) {
        setHtml(html);
    }
}

