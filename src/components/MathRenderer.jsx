"use client"


import parse from "html-react-parser";

export default function MathRenderer({math}) {
    return <>{parse(math)}</>;
}
