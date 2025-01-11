
import Markdown from 'react-markdown';

export default function MarkdownComponent() {
	const markdown = '# Hello Markdown!\n## This is a second level heading\nThis is some **bold text**';

	return<><h1>This is a server component</h1><Markdown>{markdown}</Markdown></>;
}
