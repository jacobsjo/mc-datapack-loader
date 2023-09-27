import { Identifier } from "deepslate";
import { ResourceLocation } from "../DataType";
import { PackMcmeta } from "../PackMcmeta";
import { Datapack } from "./Datapack";



export class PromiseDatapack implements Datapack{
    constructor(private promise: Promise<Datapack>){}

    async getFilename(): Promise<string> {
        return (await this.promise).getFilename()
    }

    async setPackVersion(version: number): Promise<void> {
        (await this.promise).setPackVersion(version)
    }

    async getImage(base64?: boolean): Promise<string> {
        return (await this.promise).getImage()
    }

    async getMcmeta(): Promise<PackMcmeta | undefined> {
        return (await this.promise).getMcmeta()
    }

    async has(type: ResourceLocation, id: Identifier): Promise<boolean> {
        return (await this.promise).has(type, id)
    }
    
    async getIds(type: ResourceLocation): Promise<Identifier[]> {
        return (await this.promise).getIds(type)
    }
    
    async get(type: ResourceLocation, id: Identifier): Promise<unknown> {
        return (await this.promise).get(type, id)
    }

    async canSave(): Promise<boolean> {
        return (await this.promise).canSave()
    }

    async save(type: ResourceLocation, id: Identifier, data: unknown): Promise<boolean> {
        return (await this.promise).save(type, id, data)
    }

    async prepareSave(): Promise<void> {
        return (await this.promise).prepareSave()
    }

}
