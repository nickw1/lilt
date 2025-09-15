import fs from 'node:fs/promises';
import { loadEnvFile } from 'node:process';

export default async function GetStaticContent(context) {
    loadEnvFile();
    const match = /\/static\/([\w-]*\.(\w+))$/.exec(context.url.pathname);
    if(match) {
        try {
            const content = await fs.readFile(`${process.env.RESOURCES}/static/${match[1]}`);
            return new Response(content);
        } catch(e) {
            const notfound = e.code == "ENOENT";
            return new Response(notfound ? "404 Not Found": e.code, {
                status: notfound ? 404: 500
            });
        }
    } else {
        return new Response(
            JSON.stringify(
                {error: "Invalid URL: resources must only contain letters, numbers, underscores and dashes."}
            ), {
                headers: {"Content-Type": "application/json" },
                status: 400
            }
        );
    }
}
