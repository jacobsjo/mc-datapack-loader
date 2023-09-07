import { Identifier } from "deepslate"
import { DatapackList } from "../DatapackList"
import { DataType, JsonDataType } from "../DataType"
import { AnonymousDatapack, Datapack } from "./Datapack"

export class CompositeDatapack implements AnonymousDatapack {
    constructor(
        private readers: DatapackList
    ) { }

    async has(type: DataType, id: Identifier): Promise<boolean> {
        const has = await Promise.all(this.readers.getDatapacks().map(reader => reader.has(type, id)))
        return has.includes(true)
    }

    async getIds(type: DataType): Promise<Identifier[]> {
        return (await Promise.all(this.readers.getDatapacks().map(reader => reader.getIds(type)))).flat().filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.equals(value)
            ))
        )
    }

    async get(type: DataType, id: Identifier): Promise<unknown | ArrayBuffer> {
        const has = await Promise.all(this.readers.getDatapacks().map(reader => reader.has(type, id)))

        if (type.startsWith("tags/")) {
            var list: string[] = []
            var has_replace: boolean = false
            for (const i in has) {
                if (!has[i])
                    continue

                const json = (await this.readers.getDatapacks()[i].get(type, id)) as any
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

                const json = (await this.readers.getDatapacks()[i].get(type, id)) as any
                Object.assign(result, json)
            }
            return result
        } else {
            const hasIndex = has.lastIndexOf(true)
            if (hasIndex < 0) {
                return undefined
            }
            return this.readers.getDatapacks()[hasIndex].get(type, id)
        }
    }

    canSave(): boolean {
        return false
    }

    async prepareSave(): Promise<void> {

    }

    save(type: DataType, id: Identifier, data: unknown): Promise<boolean> {
        throw new Error("Can't save to Composite Datapack")
    }

}