"use client"

import { createRoot } from 'react-dom/client';
import Markdown from 'react-markdown';

export default function MarkdownComponent() {
	const markdown = '# Hello Markdown!\n## This is a second level heading\nThis is some **bold text**';

    return <Markdown>{markdown}</Markdown>;
}
