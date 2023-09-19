import { FileAccess } from "./FileAccess";




export class SubFolderFileAccess implements FileAccess{

    constructor(
        private parentAccess: FileAccess,
        private parentPath: string
    ){
        if (!this.parentPath.endsWith("/")){
            this.parentPath += "/"
        }
    }

    getFilename(): string {
        return `[${this.parentAccess.getFilename()} at ${this.parentPath}]`
    }

    getSubfolders(path: string): Promise<string[]> {
        return this.parentAccess.getSubfolders(this.parentPath + path)
    }

    getAllFiles(path: string): Promise<string[]> {
        return this.parentAccess.getAllFiles(this.parentPath + path)
    }

    has(path: string): Promise<boolean> {
        return this.parentAccess.has(this.parentPath + path)
    }

    readFile(path: string, type: "string"): Promise<string | undefined>;
    readFile(path: string, type: "arraybuffer"): Promise<ArrayBuffer | undefined>;
    readFile(path: string, type: "string"|"arraybuffer"): Promise<string | ArrayBuffer | undefined> {
        return this.parentAccess.readFile(this.parentPath + path, type)
    }

    writeFile?(path: string, data: string | ArrayBuffer): Promise<boolean> {
        return this.parentAccess.writeFile?.(this.parentPath + path, data) ?? Promise.resolve(false)
    }

    prepareWrite?(): Promise<void> {
        return this.parentAccess.prepareWrite?.() ?? Promise.reject()
    }

}