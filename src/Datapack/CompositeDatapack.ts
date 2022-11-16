import { Identifier } from "deepslate"
import { DataType, JsonDataType } from "../DataType"
import { UNKOWN_PACK } from "../unkown_pack"
import { Datapack } from "./Datapack"

export class CompositeDatapack implements Datapack{
    constructor (
        public readers: Datapack[] = []
    ){}
    
    async getImage(): Promise<string> {
        return UNKOWN_PACK
    }

    async getName(): Promise<string> {
        return `[${this.readers.map(r => r.getName()).join(", ")}]`
    }

    async getMcmeta(): Promise<unknown> {
        return {
            pack: {
                description: "Combination of multiple datapacks",
            }
        }
    }

    async has(type: DataType, id: Identifier): Promise<boolean> {
        const has = await Promise.all(this.readers.map(reader => reader.has(type, id)))
        return has.includes(true)
    }

    async getIds(type: DataType): Promise<Identifier[]> {
        return [... new Set( (await Promise.all(this.readers.map(reader => reader.getIds(type)))).flat())]
    }

    async get(type: DataType, id: Identifier): Promise<unknown | ArrayBuffer> {
        const has = await Promise.all(this.readers.map(reader => reader.has(type, id)))

        if (type.startsWith("tags/")){
            console.warn("Tags are not supported yet")
        }

        const hasIndex = has.lastIndexOf(true)
        if (hasIndex < 0){
            return undefined
        }
        return this.readers[hasIndex].get(type, id)
    }

    canSave(){
        const canSave = this.readers.map(reader => reader.save !== undefined)
        return canSave.includes(true)
    }

    async save?(type: DataType, id: Identifier, data: typeof type extends JsonDataType ? unknown : ArrayBuffer): Promise<boolean> {
        const canSave = this.readers.map(reader => reader.save !== undefined)
        const canSaveIndex = canSave.lastIndexOf(true)
        if (canSaveIndex === -1){
            return false
        }
        return await this.readers[canSaveIndex].save!(type, id, data)
    }

    async prepareSave(){
        const canSave = this.readers.map(reader => reader.save !== undefined)
        const canSaveIndex = canSave.lastIndexOf(true)
        if (canSaveIndex === -1){
            return
        }
        await this.readers[canSaveIndex].prepareSave?.()
    }

}