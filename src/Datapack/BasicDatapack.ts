import { Identifier } from "deepslate";
import { FileAccess } from "../FileAccess/FileAccess";
import { Datapack } from "./Datapack";
import stripJsonComments from "strip-json-comments"
import { UNKOWN_PACK } from "../unkown_pack"
import { base64ArrayBuffer } from "../base64ArrayBuffer"
import { PackMcmeta } from "../PackMcmeta";
import { SubFolderFileAccess } from "../FileAccess/SubFolderFileAccess";
import { OverlaiedDatapack } from "./OverlaiedDatapack";
import { DataType } from "../DataType";

export class BasicDatapack implements Datapack{
    private baseFolder: string

    constructor(
        public readonly fileAccess: FileAccess,
        baseFolder: string = "data/",
        private jsonParser: (str: string) => unknown = (str) => JSON.parse(stripJsonComments(str)),
        private jsonStringifier: (value: any) => string = (value) => JSON.stringify(value, null, 2)
    ){
        this.baseFolder = baseFolder
        if (!this.baseFolder.endsWith("/")){
            this.baseFolder += "/"
        }
    }

    async setPackVersion(version: number): Promise<void> {
         
    }

    async getImage(): Promise<string> {
        try {
            const arrayBuffer = await this.fileAccess.readFile("pack.png", "arraybuffer")
            if (arrayBuffer === undefined){
                return UNKOWN_PACK
            }
            return "data:image/png;base64," + base64ArrayBuffer(arrayBuffer)
        } catch {
            return UNKOWN_PACK
        }
    }

    async getMcmeta(): Promise<PackMcmeta | undefined> {
        const text = await this.fileAccess.readFile("pack.mcmeta", "string")
        if (text === undefined) return undefined
        return this.jsonParser(text) as PackMcmeta
    }

    async has(type: DataType.Path, id: Identifier): Promise<boolean> {
        return await this.fileAccess.has(this.getPath(type, id))
    }

    async getIds(type: DataType.Path): Promise<Identifier[]> {
        return (await Promise.all(
            (await this.fileAccess.getSubfolders(this.baseFolder))
                .map(async namespace => (await this.fileAccess.getAllFiles(`${this.baseFolder}${namespace}/${type}`))
                    .filter(file => file.endsWith(`.${DataType.PATH_PROPERTIES[type].fileExtension}`))
                    .map(file => new Identifier(namespace, file.substring(0, file.lastIndexOf("."))))))
            ).flat()
    }

    async get(type: DataType.Path, id: Identifier): Promise<unknown> {
        const path = this.getPath(type, id)
        if (DataType.PATH_PROPERTIES[type].reader === "arraybuffer"){
            return await this.fileAccess.readFile(path, "arraybuffer")
        } else {
            const text = await (await this.fileAccess).readFile(path, "string")
            if (text === undefined) return undefined
            return this.jsonParser(text)
        }
    }

    protected getPath(type: DataType.Path, id: Identifier){
        if (type === ""){
            return `${this.baseFolder}${id.namespace}/${id.path}.${DataType.PATH_PROPERTIES[type].fileExtension}`
        } else {
            return `${this.baseFolder}${id.namespace}/${type}/${id.path}.${DataType.PATH_PROPERTIES[type].fileExtension}`
        }
    }

    async canSave(): Promise<boolean> {
        return this.fileAccess.writeFile !== undefined
    }

    async prepareSave(): Promise<void> {
        return this.fileAccess.prepareWrite?.()
    }

    async save(type: DataType.Path, id: Identifier, data: unknown | ArrayBuffer): Promise<boolean> {
        if (!this.canSave)
            throw new Error("Can't write to readonly Datapack")
        const path = this.getPath(type, id)
        const writeData = DataType.PATH_PROPERTIES[type].fileExtension === "json" ? this.jsonStringifier(data) : (data as ArrayBuffer)
        return await this.fileAccess.writeFile?.(path, writeData) ?? false
    }


}