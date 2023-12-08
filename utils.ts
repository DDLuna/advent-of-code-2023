
export function readFile(path: string): string {
    return Deno.readTextFileSync(path).trim();
}

export function readLines(path: string): Array<string> {
    return readFile(path).split(/\r?\n/g);
}
