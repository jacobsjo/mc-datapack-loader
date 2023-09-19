import { FileAccess } from "./FileAccess";

export class FileSystemDirectoryFileAccess implements FileAccess{

    constructor(
        private directory: FileSystemDirectoryHandle,
    ){

    }

    getFilename(): string {
        return this.directory.name
    }

    async getSubfolders(path: string): Promise<string[]> {
        const handle = await this.getHandle(path, true)
        if (handle === undefined) return []

        const folders = []
        for await (const [name, e] of handle){
            if (e.kind === "directory"){
                folders.push(name)
            }
        }
        return folders
    }

    async getAllFiles(path: string): Promise<string[]> {
        const handle = await this.getHandle(path, true)
        
        if (handle === undefined) return []

        async function processDirectory(handle: FileSystemDirectoryHandle): Promise<string[]>{
            const files = []
            for await (const [name, e] of handle){
                if (e.kind === "file"){
                    files.push(name)
                } else {
                    files.push(...(await processDirectory(e)).map(p => `${name}/${p}`) )
                }
            }
            return files
        }

        return processDirectory(handle)
    }

    async has(path: string): Promise<boolean> {
        return (await this.getHandle(path)) !== undefined
    }

    readFile(path: string, type: "string"): Promise<string | undefined>;
    readFile(path: string, type: "arraybuffer"): Promise<ArrayBuffer | undefined>;
    async readFile(path: string, type: "arraybuffer" | "string"): Promise<string | ArrayBuffer | undefined> {
        const file = (await this.getHandle(path))?.getFile()
        if (file === undefined)
            return undefined
        if (type == "arraybuffer"){
            return (await file).arrayBuffer()
        } else {
            return (await file).text()
        }
    }

    async prepareWrite(): Promise<void>{
        await this.directory.requestPermission({mode: 'readwrite'})
    }

    async writeFile(path: string, data: string | ArrayBuffer): Promise<boolean> {
        var writable
        try {
            writable = await (await this.getHandle(path, false, true))?.createWritable()
            await writable?.write(data)
        } catch (e) {
            writable?.abort()
            return false
        }

        return true
    }

    private getHandle(path: string, folder?: false, create?: boolean ): Promise<FileSystemFileHandle | undefined>
    private getHandle(path: string, folder: true, create?: boolean): Promise<FileSystemDirectoryHandle | undefined>
    private async getHandle(path: string, folder: boolean = false, create: boolean = false): Promise<FileSystemHandle | undefined>{
        //console.log(`getHandle(${path})`)

        try{
            if (path.endsWith("/")){
                path = path.slice(0, -1)
            }

            const path_parts = path.split("/")
            const filename = path_parts.pop()

            if (filename === undefined) return undefined

            var directory = this.directory
            for (const dir of path_parts){
                directory = await (directory.getDirectoryHandle(dir, {create: create}))
                if (directory === undefined) return undefined
            }

            if (folder){
                return await (directory.getDirectoryHandle(filename, {create: create}))
            } else {
                return await (directory.getFileHandle(filename, {create: create}))
            }
        } catch {
            return undefined
        }
    }
}