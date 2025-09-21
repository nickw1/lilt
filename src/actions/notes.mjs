"use server"

import fs from "node:fs/promises";
import useLoggedIn from '../hooks/login.mjs';

export async function saveNotes(module, topicNum, notes) {
    const { isAdmin } = await useLoggedIn();
    if(!isAdmin) {
        return {"error" : "Only admins can save notes."};
    }
    if(topicNum.match("^\\d+$") && module.match("^\\w+$")) {
        try {
            await fs.writeFile(`${process.env.RESOURCES}/${module}/${topicNum}.md`, notes);
            return { message: "Saved successfully." };
        } catch(e) {
            return { error: e.message };
        }
    } else {
        return { error: "Invalid topic number and/or module code." };
    }
}
