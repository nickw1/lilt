"use client"

import { useActionState } from 'react';
import { uploadFile } from '../actions/files.mjs';

export default function StaticUploadComponent() {

    const [state, uploadFileWithState] = useActionState(uploadFile, { });

    return <div>
        <h2>Upload a static file</h2>
        <p><em>Max size 0.5 MB</em></p>
        <form action={uploadFileWithState}>
        <input type="file" name="staticFile" />
        <button type="submit">Upload file</button> 
        </form>
        <div style={{backgroundColor: state.error ? '#ffc0c0' : '#c0ffc0'}}>{state.error || (state.success ? "Successfully uploaded." : "") }</div>
        </div>;
}
