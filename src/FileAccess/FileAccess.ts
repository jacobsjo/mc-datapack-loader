

export interface FileAccess {
    getSubfolders(path: string): Promise<string[]>
    getAllFiles(path: string): Promise<string[]>
    has(path: string): Promise<boolean>

    readFile(path: string, type: "string"): Promise<string | undefined>
    readFile(path: string, type: "arraybuffer"): Promise<ArrayBuffer | undefined>

    writeFile?(path: string, data: string | ArrayBuffer): Promise<boolean>
    prepareWrite?(): Promise<void>
}
