import { Identifier } from "deepslate";
import { DataType } from "../DataType";
import { FileAccess } from "../FileAccess/FileAccess";
import { Datapack } from "./Datapack";
import stripJsonComments from "strip-json-comments"
import { UNKOWN_PACK } from "../unkown_pack"
import { base64ArrayBuffer } from "../base64ArrayBuffer"
import { getFileType } from "../util";

export class BasicDatapack implements Datapack{
    constructor(
        private fileAccess: Promise<FileAccess>,
        private jsonParser: (str: string) => unknown = (str) => JSON.parse(stripJsonComments(str)),
        private jsonStringifier: (value: any) => string = (value) => JSON.stringify(value, null, 2)
    ){

    }

    async getImage(): Promise<string> {
        try {
            const arrayBuffer = await (await this.fileAccess).readFile("pack.png", "arraybuffer")
            if (arrayBuffer === undefined){
                return UNKOWN_PACK
            }
            return "data:image/png;base64," + base64ArrayBuffer(arrayBuffer)
        } catch {
            return UNKOWN_PACK
        }
    }

    async getName(): Promise<string> {
        return "NOT IMPLEMENTED"
    }

    async getMcmeta(): Promise<unknown> {
        const text = await (await this.fileAccess).readFile("path.mcmeta", "string")
        if (text === undefined) return undefined
        return this.jsonParser(text)
    }

    async has(type: DataType, id: Identifier): Promise<boolean> {
        return await (await this.fileAccess).has(this.getPath(type, id))
    }

    async getIds(type: DataType): Promise<Identifier[]> {
        return (await Promise.all(
            (await (await this.fileAccess).getSubfolders("data"))
                .map(async namespace => (await (await this.fileAccess).getAllFiles(`data/${namespace}/${type}/`))
                    .map(file => new Identifier(namespace, file.substring(0, file.lastIndexOf("."))))))
            ).flat()
    }

    async get(type: DataType, id: Identifier): Promise<unknown> {
        const fileType = getFileType(type)
        const path = this.getPath(type, id)
        if (fileType === "nbt"){
            return await (await this.fileAccess).readFile(path, "arraybuffer")
        } else {
            const text = await (await this.fileAccess).readFile(path, "string")
            if (text === undefined) return undefined
            return this.jsonParser(text)
        }
    }

    protected getPath(type: DataType, id: Identifier){
        return `data/${id.namespace}/${type}/${id.path}.${getFileType(type)}`
    }


    async prepareSave?(): Promise<void> {
        return await (await this.fileAccess).prepareWrite?.()
    }

    async save?(type: DataType, id: Identifier, data: unknown | ArrayBuffer): Promise<boolean> {
        const fileType = getFileType(type)
        const path = this.getPath(type, id)
        const writeData = fileType === "json" ? this.jsonStringifier(data) : (data as ArrayBuffer)
        return await (await this.fileAccess).writeFile?.(path, writeData) ?? false
    }


}