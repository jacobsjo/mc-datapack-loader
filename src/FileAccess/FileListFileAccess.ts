import { FileAccess, removeBom } from "./FileAccess"

interface MyFile extends File{
    readonly webkitRelativePath: string;
}

export class FileListFileAccess implements FileAccess{
    private files: MyFile[]
    private parentFolder: string

    constructor(
        files: File[],
    ){
        this.files = files.map(f => <MyFile>f)
        this.parentFolder = this.files[0].webkitRelativePath.split('/')[0]
    }

    getFilename(): string {
        return this.parentFolder
    }

    async getAllFiles(path: string): Promise<string[]> {
        if (path.length > 0 && !path.endsWith("/")) path = path + "/"
        path = `${this.parentFolder}/${path}`
        return this.files.map(file => file.webkitRelativePath).filter(p => p.startsWith(path)).map(p => p.substring(path.length))
    }

    async getSubfolders(path: string): Promise<string[]> {
        return [...new Set((await this.getAllFiles(path)).map(p => p.split("/")[0]))]
    }

    async has(path: string): Promise<boolean> {
        path = `${this.parentFolder}/${path}`
        return this.files.findIndex(file => file.webkitRelativePath === path) >= 0
    }

    readFile(path: string, type: "string"): Promise<string | undefined>
    readFile(path: string, type: "arraybuffer"): Promise<ArrayBuffer | undefined>
    async readFile(path: string, type: "arraybuffer" | "string"): Promise<string | ArrayBuffer | undefined> {
        path = `${this.parentFolder}/${path}`
        const file = this.files.find(file => file.webkitRelativePath === path)
        if (!file)
            return undefined
        if (type == "arraybuffer"){
            return await file.arrayBuffer()
        } else {
            return removeBom(await file.text())
        }
    }
}