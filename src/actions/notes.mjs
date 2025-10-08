"use server"

import fs from "node:fs/promises";
import { loadEnvFile } from 'node:process';
import useLoggedIn from '../hooks/login.mjs';


export async function saveNotes(module, topicNum, notes) {
    const { isAdmin } = await useLoggedIn();
    loadEnvFile();
    if(!isAdmin) {
        return {"error" : "Only admins can save notes."};
    } else if (process.env.EDIT_NOTES_ENABLED !== "true") {
        return {"error" : "Note editing disabled."};
    }
    if(topicNum.match("^\\d+$") && module.match("^\\w+$")) {
        try {
            await fs.writeFile(`${process.env.RESOURCES}/${module}/${topicNum}.md`, notes);
            return { message: "Saved successfully." };
        } catch(e) {
            return { error: e.code == "ENOENT" ? `Notes for ${module}, topic ${topicNum} not found.` : e.code };
        }
    } else {
        return { error: "Invalid topic number and/or module code." };
    }
}
