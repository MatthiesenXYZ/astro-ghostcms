import { fileURLToPath } from 'node:url';
import path from "node:path";
import pkg from 'fs-extra';
const { readFileSync } = pkg;

export async function GET(){
    const response = readFileSync(path.resolve(fileURLToPath(import.meta.url), "..", 'rss-style.xsl'));
    const buffer = Buffer.from((response));
    return new Response(buffer, {
        headers: { "Content-Type": "text/xsl" },
    });
}

