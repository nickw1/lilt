"use client"
import type { SyntaxHighlightProps } from "../types";

import { HTMLAttributes, useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import parse from "html-react-parser";


export default function SyntaxHighlight({ children, lang }: SyntaxHighlightProps) {

    if (typeof children !== "string") {
        throw `SyntaxHighlight: unexpected children type: ${typeof children}`;
    }
    const [html, setHtml] = useState("");
    // <script> tags in Markdown code blocks cause problems with rendering
    // They need to be entity-encoded (&lt; and &gt;) in the code blocks.
    // Then we unencode them here, then codeToHtml() encodes them again

    // TODO perhaps this isn't a problem with tinyrsc? Not sure, need to test

    useEffect(() => {

        (async () => {
            //const unencodedChildren = children.replaceAll(/&lt;script(.*)&gt;(.*)&lt;\/script&gt;/g, `<script$1>$2</script>`);
            //  const lang = props.className?.includes('lang-') ? props.className.substring(5) : "";

            const html = await codeToHtml(children, {
                lang: lang ?? "",
                theme: 'vitesse-dark'
            }); //.then(html => setHtmlWithUnescape(html));
            setHtml(html);
        })();


        /*
        function setHtmlWithUnescape(html) {
            setHtml(html);
        }
        */
    }, [children, lang]);

    return <div>{parse(html)}</div>;
   // return <Interweave content={html} />
}