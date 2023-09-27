import { Identifier } from "deepslate"
import { DatapackList } from "../DatapackList"
import { ResourceLocation } from "../DataType"
import { AnonymousDatapack, Datapack } from "./Datapack"

export class CompositeDatapack implements AnonymousDatapack {
    constructor(
        private datapacks: DatapackList = DatapackList.EMPTY,
        private merge: boolean = true
    ) { }

    async has(location: ResourceLocation, id: Identifier): Promise<boolean> {
        const has = await Promise.all((await this.datapacks.getDatapacks()).map(reader => reader.has(location, id)))
        return has.includes(true)
    }

    async getIds(location: ResourceLocation): Promise<Identifier[]> {
        return (await Promise.all((await this.datapacks.getDatapacks()).map(reader => reader.getIds(location)))).flat().filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.equals(value)
            ))
        )
    }

    async get(location: ResourceLocation, id: Identifier): Promise<unknown | ArrayBuffer> {
        const datapacks = await this.datapacks.getDatapacks()

        const has = await Promise.all(datapacks.map(reader => reader.has(location, id)))

        const mergingType = this.merge ? location.merging : "override"
        if (mergingType === "tags") {
            var list: string[] = []
            var has_replace: boolean = false
            for (const i in has) {
                if (!has[i])
                    continue

                const json = (await datapacks[i].get(location, id)) as any
                if (!json) {
                    console.warn(`Error reading ${location} ${id} from datapack ${i}`)
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
        } else if (mergingType === "assign") {
            var result = {}
            for (const i in has) {
                if (!has[i])
                    continue

                const json = (await datapacks[i].get(location, id)) as any
                Object.assign(result, json)
            }
            return result
        } else {
            const hasIndex = has.lastIndexOf(true)
            if (hasIndex < 0) {
                return undefined
            }
            return datapacks[hasIndex].get(location, id)
        }
    }

    async canSave(): Promise<boolean> {
        return false
    }

    async prepareSave(): Promise<void> {

    }

    save(location: ResourceLocation, id: Identifier, data: unknown): Promise<boolean> {
        throw new Error("Can't save to Composite Datapack")
    }

}