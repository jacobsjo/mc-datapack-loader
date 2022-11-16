import { Identifier } from "deepslate"
import stripJsonComments from "strip-json-comments"
import { DataType, JsonDataType } from "../DataType"
import { UNKOWN_PACK } from "../unkown_pack"
import { getFileType, idToPath } from "../util"
import { Datapack } from "./Datapack"

interface MyFile extends File{
    readonly webkitRelativePath: string;
}

export class FileSystemDirectoryDatapack implements Datapack{
    constructor(
        private directory: FileSystemDirectoryHandle,
        private parser: (str: string) => unknown = (str) => JSON.parse(stripJsonComments(str)),
        private stringifier: (value: any) => string = (value) => JSON.stringify(value, null, 2)
    ){}

    async getImage(): Promise<string> {
        try {
            const fileHandle = this.directory.getFileHandle("pack.png")
            const file = await (await fileHandle).getFile()
            return URL.createObjectURL(file)
        } catch {
            return UNKOWN_PACK
        }
    }

    async getName(): Promise<string> {
        return this.directory.name
    }

    async getMcmeta(): Promise<unknown> {
        try {
            const fileHandle = this.directory.getFileHandle("pack.mcmeta")
            const file = await (await fileHandle).getFile()
            return this.parser(await file.text())
        } catch {
            return {}
        }
    }


    private async getDataDirectory(): Promise<FileSystemDirectoryHandle>{
        return (await this.directory.getDirectoryHandle("data"))
    }

    async has(type: DataType, id: Identifier): Promise<boolean> {  
        return (await this.getFile(type, id)) !== undefined
    }

    async getIds(type: DataType): Promise<Identifier[]> {
        const type_dirs = type.split("/")

        const ids: Identifier[] = []

        const addDir = async (namespace: string, path: string, directory: FileSystemDirectoryHandle) => {
            for await (const [name, e] of (await directory.entries())){
                if (e.kind === "file"){
                    ids.push(new Identifier(namespace, path + name.substring(0, name.lastIndexOf("."))))
                } else {
                    await addDir(namespace, path + name + "/", e)
                }
            }
        }

        namespaces: for await (const [namespace, entry] of (await this.getDataDirectory()).entries()) {
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
       
            await addDir(namespace, "", directory)
        }
        return ids
    }

    async get(type: DataType, id: Identifier): Promise<unknown | ArrayBuffer> {
        const file = await this.getFile(type, id)
        if (file === undefined) return undefined

        if (!file)
            return undefined
        const fileType = getFileType(type)
        if (fileType == "json"){
            return this.parser(await (await file.getFile()).text())
        } else {
            return await (await file.getFile()).arrayBuffer()
        }
    }

    async save?(type: DataType, id: Identifier, data: unknown | ArrayBuffer): Promise<boolean> {
        try{
            const file = await this.getFile(type, id, true)
            if (file === undefined){
                return false
            }

            const fileType = getFileType(type)
            var output: FileSystemWriteChunkType
            if (fileType == "json"){
                JSON.stringify
                output = typeof data === 'string' ? data : this.stringifier(data)
            } else {
                output = (data as ArrayBuffer)
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

    private async getFile(type: DataType, id: Identifier, create: boolean = false): Promise<FileSystemFileHandle | undefined>{
        try{
            var directory = await (await this.getDataDirectory()).getDirectoryHandle(id.namespace, {create: create})
            if (directory === undefined) return undefined

            const dirs = type.split("/")
            const name_parts = id.path.split("/")
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