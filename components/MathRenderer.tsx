"use client"

import parse from "html-react-parser";
import type { MathProps } from '../types';

export default function MathRenderer({math} : MathProps) {
    return <>{parse(math)}</>;
}
