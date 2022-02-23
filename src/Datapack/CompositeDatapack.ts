import { DataType, JsonDataType } from "../DataType"
import { Datapack } from "./Datapack"

export class CompositeDatapack implements Datapack{
    constructor (
        public readers: Datapack[] = []
    ){}

    async has(type: DataType, id: string): Promise<boolean> {
        const has = await Promise.all(this.readers.map(reader => reader.has(type, id)))
        return has.includes(true)
    }

    async getIds(type: DataType): Promise<string[]> {
        return [... new Set( (await Promise.all(this.readers.map(reader => reader.getIds(type)))).flat())]
    }

    async get(type: DataType, id: string): Promise<(typeof type extends JsonDataType ? unknown : ArrayBuffer) | undefined> {
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
}