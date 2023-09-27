

export interface FileAccess {
    getFilename(): string

    getSubfolders(path: string): Promise<string[]>
    getAllFiles(path: string): Promise<string[]>
    has(path: string): Promise<boolean>

    readFile(path: string, type: "string"): Promise<string | undefined>
    readFile(path: string, type: "arraybuffer"): Promise<ArrayBuffer | undefined>
    readFile(path: string, type: "string" | "arraybuffer"): Promise<string | ArrayBuffer | undefined>

    writeFile?(path: string, data: string | ArrayBuffer): Promise<boolean>
    prepareWrite?(): Promise<void>
}

export function removeBom(res: string): string {
    if (res.charCodeAt(0) === 0xFEFF) {
        res = res.substring(1);
    }
    return res
}