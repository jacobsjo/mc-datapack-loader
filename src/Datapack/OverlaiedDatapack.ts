import { Identifier } from "deepslate";
import { DatapackList } from "../DatapackList";
import { DataType } from "../DataType";
import { PackMcmeta } from "../PackMcmeta";
import { CompositeDatapack } from "./CompositeDatapack";
import { AnonymousDatapack, Datapack } from "./Datapack";




export class OverlaiedDatapack extends CompositeDatapack implements Datapack{

    constructor(
        private mainPack: Datapack,
        overlays: AnonymousDatapack[] = []
    ) { 
        super(new class implements DatapackList {
            getDatapacks(): AnonymousDatapack[] {
                return [mainPack, ...overlays]
            }
        })
    }

    getImage(): Promise<string> {
        return this.mainPack.getImage()
    }

    getMcmeta(): Promise<PackMcmeta | undefined> {
        return this.mainPack.getMcmeta()
    }

    async canSave(): Promise<boolean> {
        return this.mainPack.canSave()
    }

    async prepareSave(): Promise<void> {
        await this.mainPack.prepareSave()
    }

    save(type: DataType.Path, id: Identifier, data: unknown): Promise<boolean> {
        return this.mainPack.save(type, id, data)
    }

}
