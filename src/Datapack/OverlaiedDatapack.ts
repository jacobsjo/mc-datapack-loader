import { DatapackList } from "../DatapackList";
import { ResourceLocation } from "../DataType";
import { SubFolderFileAccess } from "../FileAccess/SubFolderFileAccess";
import { PackMcmeta } from "../PackMcmeta";
import { BasicDatapack } from "./BasicDatapack";
import { CompositeDatapack } from "./CompositeDatapack";
import { AnonymousDatapack, Datapack } from "./Datapack";
import { PackFormat } from "../PackFormat";
import { Identifier } from "../Identifier";

export class OverlaiedDatapack extends CompositeDatapack implements Datapack{

    private list: DL

    constructor(
        private mainPack: BasicDatapack,
        packVersion: PackFormat
    ) { 
        const list = new DL(mainPack, packVersion)
        super(list, false)

        this.list = list
    }

    getFilename(): Promise<string> {
        return this.mainPack.getFilename()
    }

    async setPackVersion(packVersion: number | PackFormat): Promise<void>{
        if (typeof packVersion === 'number'){
            this.list.packVersion = new PackFormat(packVersion)
        } else {
            this.list.packVersion = packVersion
        }
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

    save(type: ResourceLocation, id: Identifier, data: unknown): Promise<boolean> {
        return this.mainPack.save(type, id, data)
    }

}

class DL implements DatapackList {

    public mcMeta: Promise<PackMcmeta | undefined>
    constructor(
        private mainPack: BasicDatapack,
        public packVersion: PackFormat
    ) {
        this.mcMeta = this.mainPack.getMcmeta()
    }

    async getDatapacks(): Promise<AnonymousDatapack[]> {
        const mcMeta = await this.mcMeta
        if (this.packVersion.compare(new PackFormat(15)) >= 0 ) return [this.mainPack] // no overlays in 1.20.1 and earlier
        if (mcMeta === undefined) return [this.mainPack]
        if (mcMeta.overlays === undefined) return [this.mainPack]

        const overlays = mcMeta.overlays
            .filter(
                e => PackMcmeta.MatchFormatRange(e.formats, this.packVersion)
            )
            .map(
                e => new BasicDatapack(new SubFolderFileAccess(this.mainPack.fileAccess, e.directory))
            )

        return [this.mainPack, ...overlays]
    }
}