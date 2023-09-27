import { Identifier } from "deepslate";
import { FileAccess } from "../FileAccess/FileAccess";
import { Datapack } from "./Datapack";
import stripJsonComments from "strip-json-comments"
import { UNKOWN_PACK } from "../unkown_pack"
import { base64ArrayBuffer } from "../base64ArrayBuffer"
import { PackMcmeta } from "../PackMcmeta";
import { ResourceLocation } from "../DataType";

export class BasicDatapack implements Datapack{
    constructor(
        public readonly fileAccess: FileAccess,
        private jsonParser: (str: string) => unknown = (str) => JSON.parse(stripJsonComments(str)),
        private jsonStringifier: (value: any) => string = (value) => JSON.stringify(value, null, 2)
    ){
    }

    async getFilename(): Promise<string> {
        return this.fileAccess.getFilename()
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

    async has(location: ResourceLocation, id: Identifier): Promise<boolean> {
        return await this.fileAccess.has(this.getPath(location, id))
    }

    async getIds(location: ResourceLocation): Promise<Identifier[]> {
        return (await Promise.all(
            (await this.fileAccess.getSubfolders(`${location.type}/`))
                .map(async namespace => (await this.fileAccess.getAllFiles(`${location.type}/${namespace}/${location.location}`))
                    .filter(file => file.endsWith(`.${location.fileExtension}`))
                    .flatMap(file => {
                        try {
                            return new Identifier(namespace, file.substring(0, file.lastIndexOf(".")))
                        } catch {
                            return []
                        }
                    })))
            ).flat()
    }

    async get(location: ResourceLocation, id: Identifier): Promise<unknown> {
        const path = this.getPath(location, id)
        if (location.reader === "arraybuffer"){
            return await this.fileAccess.readFile(path, "arraybuffer")
        } else {
            const text = await (await this.fileAccess).readFile(path, "string")
            if (text === undefined) return undefined
            return this.jsonParser(text)
        }
    }

    protected getPath(location: ResourceLocation, id: Identifier){
        if (location.location === ""){
            return `${location.type}/${id.namespace}/${id.path}.${location.fileExtension}`
        } else {
            return `${location.type}/${id.namespace}/${location.location}/${id.path}.${location.fileExtension}`
        }
    }

    async canSave(): Promise<boolean> {
        return this.fileAccess.writeFile !== undefined
    }

    async prepareSave(): Promise<void> {
        return this.fileAccess.prepareWrite?.()
    }

    async save(location: ResourceLocation, id: Identifier, data: unknown | ArrayBuffer): Promise<boolean> {
        if (!(await this.canSave()))
            throw new Error("Can't write to readonly Datapack")
        const path = this.getPath(location, id)
        const writeData = location.fileExtension === "json" ? this.jsonStringifier(data) : (data as ArrayBuffer)
        return await this.fileAccess.writeFile?.(path, writeData) ?? false
    }


}