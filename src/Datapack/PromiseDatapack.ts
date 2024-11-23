import { Identifier } from "deepslate";
import { ResourceLocation } from "../DataType";
import { PackMcmeta } from "../PackMcmeta";
import { Datapack } from "./Datapack";
import { UNKOWN_PACK } from "../unkown_pack";



export class PromiseDatapack implements Datapack{
    constructor(private promise: Promise<Datapack>){}

    getFilename(): Promise<string> {
        return this.promise.then(datapack => datapack.getFilename()).catch((reason: Error) => reason.message)
    }

    async setPackVersion(version: number): Promise<void> {
        this.promise.then(datapack => datapack.setPackVersion(version)).catch()
    }

    async getImage(): Promise<string> {
        return this.promise.then(datapack => datapack.getImage()).catch(() => UNKOWN_PACK)
    }

    async getMcmeta(): Promise<PackMcmeta | undefined> {
        return this.promise.then(datapack => datapack.getMcmeta()).catch((reason: Error) => {
            return {
                pack: {
                    pack_format: -1,
                    description: reason.message
                }
            }
        })
    }

    async has(type: ResourceLocation, id: Identifier): Promise<boolean> {
        return this.promise.then(datapack => datapack.has(type, id)).catch(() => false)
    }
    
    async getIds(type: ResourceLocation): Promise<Identifier[]> {
        return this.promise.then(datapack => datapack.getIds(type)).catch(() => [])
    }
    
    async get(type: ResourceLocation, id: Identifier): Promise<unknown> {
        return this.promise.then(datapack => datapack.get(type, id)).catch(() => undefined)
    }

    async canSave(): Promise<boolean> {
        return this.promise.then(datapack => datapack.canSave()).catch(() => false)
    }

    async save(type: ResourceLocation, id: Identifier, data: unknown): Promise<boolean> {
        return this.promise.then(datapack => datapack.save(type, id, data)).catch(() => false)
    }

    async prepareSave(): Promise<void> {
        this.promise.then(datapack => datapack.prepareSave()).catch()
    }

}
