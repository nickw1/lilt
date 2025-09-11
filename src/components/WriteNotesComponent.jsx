"use client"

import { useState } from 'react';
import MDEditor, { commands } from '@uiw/react-md-editor';
//import '@uiw/react-md-editor/dist/mdeditor.css'; 
// manual import seems to fix css issue - the dist file however doesn't work correctly
import '@uiw/react-md-editor/markdown-editor.css';
import Markdown from 'markdown-to-jsx';
import { saveNotes } from '../actions/notes.mjs';

// TODO want to use @uiw/react-md-editor for a full-featured React WYSIWYG
// editor. However there appear to be some problems with loading its
// associated CSS. So for now just edit the Markdown via a textarea.

export default function WriteNotesComponent({notes, module, topicNum}) {
    const [markdown, setMarkdown] = useState(notes);
    const [status, setStatus] = useState({message: ""});

    return <><h1>Write your notes for {module}, topic {topicNum}</h1>
        <div>
        <MDEditor value={markdown} 
            height="80%"
            onChange={setMarkdown} 
            extraCommands={[commands.group([
                commands.title1,
                commands.title2,
                commands.title3,
                commands.title4,
                commands.title5,
                commands.title6
            ], { 
                name: 'headings', 
                groupName: 'headings', 
                buttonProps: { 'aria-label': 'Insert heading' }
           })]} />
        <br />
        <button onClick={async() => {
            const result = await saveNotes(module, topicNum, markdown);
            setStatus(result);
        }}>Save Notes</button>
        </div>
        <div style={{backgroundColor: status.error ? '#ffc0c0' : '#c0ffc0'}}>
        {status.error || status.message}
        </div>
        </>;
}
