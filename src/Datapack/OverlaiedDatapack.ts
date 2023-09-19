import { Identifier } from "deepslate";
import { DatapackList } from "../DatapackList";
import { DataType } from "../DataType";
import { SubFolderFileAccess } from "../FileAccess/SubFolderFileAccess";
import { PackMcmeta } from "../PackMcmeta";
import { BasicDatapack } from "./BasicDatapack";
import { CompositeDatapack } from "./CompositeDatapack";
import { AnonymousDatapack, Datapack } from "./Datapack";




export class OverlaiedDatapack extends CompositeDatapack implements Datapack{

    private list: DL

    constructor(
        private mainPack: BasicDatapack,
        packVersion: number
    ) { 
        const list = new DL(mainPack, packVersion)
        super(list)

        this.list = list
    }

    getFilename(): Promise<string> {
        return this.mainPack.getFilename()
    }

    async setPackVersion(packVersion: number): Promise<void>{
        this.list.packVersion = packVersion
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

class DL implements DatapackList {

    constructor(
        private mainPack: BasicDatapack,
        public packVersion: number
    ) {

    }

    async getDatapacks(): Promise<AnonymousDatapack[]> {
        const mcMeta = await this.mainPack.getMcmeta()
        if (this.packVersion <= 15) return [this.mainPack] // no overlays in 1.20.1 and earlier
        if (mcMeta === undefined) return [this.mainPack]
        if (mcMeta.overlays === undefined) return [this.mainPack]

        const overlays = mcMeta.overlays.entries
            .filter(
                e => PackMcmeta.MatchFormatRange(e.formats, this.packVersion)
            )
            .map(
                e => new BasicDatapack(new SubFolderFileAccess(this.mainPack.fileAccess, e.directory))
            )

        return [this.mainPack, ...overlays]
    }
}