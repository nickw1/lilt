"use client"


import 'katex/dist/katex.min.css';

import parse from "html-react-parser";

export default function MathRenderer({math}) {
    return <>{parse(math)}</>;
}