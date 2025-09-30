"use server"

import fs, { writeFile } from 'node:fs/promises';
import { loadEnvFile } from 'node:process';
import { Buffer } from 'node:buffer';
import useLoggedIn from '../hooks/login.mjs';

export async function uploadFile(prevState, formData) {
    const MAX_SIZE = 500000;
    const { isAdmin } = await useLoggedIn();
    if(!isAdmin) {
        return { "error" : "Only admins can upload files." };
    }
    loadEnvFile();
    const file = formData.get("staticFile");
    try {
        if(file && file instanceof File) {
            if(file.size > MAX_SIZE) {
                return { "error": `File too large, max size ${MAX_SIZE} bytes.` };
            }
            await fs.writeFile(`${process.env.RESOURCES}/static/${file.name}`, 
                Buffer.from(await file.arrayBuffer())
            );
        } else {
            return { "error" : "Missing or invalid file." };
        }
    } catch(e) {
        return { "error" : `Internal error: code ${e.code}` };
    }
    return { success: true };
}
