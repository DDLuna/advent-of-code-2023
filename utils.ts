
export function readFile(path: string): string {
    return Deno.readTextFileSync(path);
}

export function readLines(path: string): Array<string> {
    return readFile(path).trim().split(/\r?\n/g);
}
