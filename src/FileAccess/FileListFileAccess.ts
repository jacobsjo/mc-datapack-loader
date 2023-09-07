import { FileAccess } from "./FileAccess"

interface MyFile extends File{
    readonly webkitRelativePath: string;
}

export class FileListFileAccess implements FileAccess{
    private files: MyFile[]

    constructor(
        files: File[],
    ){
        this.files = files.map(f => <MyFile>f)
    }

    async getAllFiles(path: string): Promise<string[]> {
        if (path.length > 0 && !path.endsWith("/")) path = path + "/"
        return this.files.map(file => file.webkitRelativePath).filter(p => p.startsWith(path)).map(p => p.substring(path.length))
    }

    async getSubfolders(path: string): Promise<string[]> {
        return [...new Set((await this.getAllFiles(path)).map(p => p.split("/")[0]))]
    }

    async has(path: string): Promise<boolean> {
        return this.files.findIndex(file => file.webkitRelativePath === path) >= 0
    }

    readFile(path: string, type: "string"): Promise<string | undefined>
    readFile(path: string, type: "arraybuffer"): Promise<ArrayBuffer | undefined>
    async readFile(path: string, type: "arraybuffer" | "string"): Promise<string | ArrayBuffer | undefined> {
        const file = this.files.find(file => file.webkitRelativePath === path)
        if (!file)
            return undefined
        if (type == "arraybuffer"){
            return await file.arrayBuffer()
        } else {
            return await file.text()
        }
    }
}