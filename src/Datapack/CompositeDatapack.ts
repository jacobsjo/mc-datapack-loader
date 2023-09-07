import { Identifier } from "deepslate"
import { DataType, JsonDataType } from "../DataType"
import { AnonymousDatapack, Datapack } from "./Datapack"

export class CompositeDatapack implements AnonymousDatapack {
    constructor(
        public readers: AnonymousDatapack[] = []
    ) { }

    async has(type: DataType, id: Identifier): Promise<boolean> {
        const has = await Promise.all(this.readers.map(reader => reader.has(type, id)))
        return has.includes(true)
    }

    async getIds(type: DataType): Promise<Identifier[]> {
        return (await Promise.all(this.readers.map(reader => reader.getIds(type)))).flat().filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.equals(value)
            ))
        )
    }

    async get(type: DataType, id: Identifier): Promise<unknown | ArrayBuffer> {
        const has = await Promise.all(this.readers.map(reader => reader.has(type, id)))

        if (type.startsWith("tags/")) {
            var list: string[] = []
            var has_replace: boolean = false
            for (const i in has) {
                if (!has[i])
                    continue

                const json = (await this.readers[i].get(type, id)) as any
                if (!json) {
                    console.warn(`Error reading ${type} ${id} from datapack ${i}`)
                    continue
                }

                if (json?.replace) {
                    list = []
                    has_replace = true
                }

                list.push(json?.values)
            }
            return {
                replace: has_replace,
                values: list.flat()
            }
        } else if (type === "") {
            var result = {}
            for (const i in has) {
                if (!has[i])
                    continue

                const json = (await this.readers[i].get(type, id)) as any
                Object.assign(result, json)
            }
            return result
        } else {
            const hasIndex = has.lastIndexOf(true)
            if (hasIndex < 0) {
                return undefined
            }
            return this.readers[hasIndex].get(type, id)
        }
    }

    canSave() {
        const canSave = this.readers.map(reader => reader.save !== undefined)
        return canSave.includes(true)
    }

    async save?(type: DataType, id: Identifier, data: typeof type extends JsonDataType ? unknown : ArrayBuffer): Promise<boolean> {
        const canSave = this.readers.map(reader => reader.save !== undefined)
        const canSaveIndex = canSave.lastIndexOf(true)
        if (canSaveIndex === -1) {
            return false
        }
        return await this.readers[canSaveIndex].save!(type, id, data)
    }

    async prepareSave() {
        const canSave = this.readers.map(reader => reader.save !== undefined)
        const canSaveIndex = canSave.lastIndexOf(true)
        if (canSaveIndex === -1) {
            return
        }
        await this.readers[canSaveIndex].prepareSave?.()
    }

}