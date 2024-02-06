import { fileURLToPath } from 'node:url';
import path from "node:path";
import pkg from 'fs-extra';
const { readFile } = pkg;

export async function GET(){
    const response = readFile(path.resolve(fileURLToPath(import.meta.url), "..", 'rss-style.xsl'));
    const buffer = Buffer.from((await response).buffer);
    return new Response(buffer, {
        headers: { "Content-Type": "text/xsl" },
    });
}

