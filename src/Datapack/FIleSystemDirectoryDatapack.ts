import { DataType, JsonDataType } from "../DataType"
import { getFileType, idToPath } from "../util"
import { Datapack } from "./Datapack"

interface MyFile extends File{
    readonly webkitRelativePath: string;
}

export class FileSystemDirectoryDatapack implements Datapack{
    constructor(
        private directory: FileSystemDirectoryHandle
    ){}


    private async getParentDirectory(): Promise<FileSystemDirectoryHandle>{
        try{
            return (await this.directory.getDirectoryHandle("data")) ?? this.directory
        } catch (e){
            if (e instanceof DOMException){
                return this.directory
            } else {
                throw e
            }
        }
    }

    async has(type: DataType, id: string): Promise<boolean> {  
        return (await this.getFile(type, id)) !== undefined
    }

    async getIds(type: DataType): Promise<string[]> {
        const type_dirs = type.split("/")

        const ids: string[] = []

        const addDir = async (namespace: string, path: string, directory: FileSystemDirectoryHandle) => {
            for await (const [name, e] of (await directory.entries())){
                if (e.kind === "file"){
                    ids.push(namespace + ":" + path + name.substr(0, name.lastIndexOf(".")))
                } else {
                    await addDir(namespace, path + name + "/", e)
                }
            }
        }

        namespaces: for await (const [namespace, entry] of (await this.getParentDirectory()).entries()) {
            if (entry.kind !== "directory")
                continue namespaces
            
            var directory = entry
            for (const dir of type_dirs){
                try{
                    directory = await (directory.getDirectoryHandle(dir))
                    if (directory === undefined) continue namespaces
                } catch {
                    continue namespaces
                }
            }
       
            addDir(namespace, "", directory)
        }
        return ids
    }

    async get(type: DataType, id: string): Promise<(typeof type extends JsonDataType ? unknown : ArrayBuffer) | undefined> {
        const file = await this.getFile(type, id)
        if (file === undefined) return undefined

        if (!file)
            return undefined
        const fileType = getFileType(type)
        if (fileType == "json"){
            return JSON.parse(await (await file.getFile()).text())
        } else {
            return await (await file.getFile()).arrayBuffer()
        }
    }

    async save?(type: DataType, id: string, data: typeof type extends JsonDataType ? unknown : ArrayBuffer): Promise<boolean> {
        try{
            const file = await this.getFile(type, id, true)
            if (file === undefined){
                return false
            }

            const fileType = getFileType(type)
            var output: string | ArrayBuffer
            if (fileType == "json"){
                output = JSON.stringify(data, null, 2)
            } else {
                output = data
            }

            var writable
            try{
                writable = await file?.createWritable();
                await writable.write(output)
                await writable.close()
            } catch (e){
                writable?.abort()
                return false
            }
            return true
       } catch (e) {
            return false
        }
    }

    async prepareSave(){
        await this.directory.requestPermission({mode: 'readwrite'})
    }

    private async getFile(type: DataType, id: string, create: boolean = false): Promise<FileSystemFileHandle | undefined>{
        try{
            const [namespace, name] = id.split(":", 2)
            var directory = await (await this.getParentDirectory()).getDirectoryHandle(namespace, {create: create})
            if (directory === undefined) return undefined

            const dirs = type.split("/")
            const name_parts = name.split("/")
            const filename = name_parts.pop()
            if (filename === undefined) return undefined

            dirs.push(...name_parts)

            for (const dir of dirs){
                directory = await (directory.getDirectoryHandle(dir, {create: create}))
                if (directory === undefined) return undefined
            }

            const file = await (directory.getFileHandle(filename + "." + getFileType(type), {create: create}))
            return file
        } catch {
            return undefined
        }
    }
}