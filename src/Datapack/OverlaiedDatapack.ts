import { PackMcmeta } from "../packMcmeta";
import { CompositeDatapack } from "./CompositeDatapack";
import { AnonymousDatapack, Datapack } from "./Datapack";




export class OverlaiedDatapack extends CompositeDatapack implements Datapack{

    constructor(
        private mainPack: Datapack,
        overlays: AnonymousDatapack[] = []
    ) { 
        super([mainPack, ...overlays])
    }

    getImage(): Promise<string> {
        return this.mainPack.getImage()
    }

    getName(): Promise<string> {
        return this.mainPack.getName()
    }

    getMcmeta(): Promise<PackMcmeta | undefined> {
        return this.mainPack.getMcmeta()
    }
}