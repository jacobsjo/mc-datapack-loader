import { Identifier } from "deepslate";
import { DatapackList } from "../DatapackList";
import { DataType } from "../DataType";
import { FileAccess } from "../FileAccess/FileAccess";
import { FileListFileAccess } from "../FileAccess/FileListFileAccess";
import { FileSystemDirectoryFileAccess } from "../FileAccess/FileSystemDirectoryFileAccess";
import { ZipFileAccess } from "../FileAccess/ZipFileAccess";
import { PackMcmeta } from "../PackMcmeta";
import { BasicDatapack } from "./BasicDatapack";
import { CompositeDatapack } from "./CompositeDatapack";


export interface AnonymousDatapack {
    has(type: DataType, id: Identifier): Promise<boolean>
    getIds(type: DataType): Promise<Identifier[]>
    get(type: DataType, id: Identifier): Promise<unknown | ArrayBuffer>

    canSave(): boolean
    save(type: DataType, id: Identifier, data: unknown | ArrayBuffer): Promise<boolean>
    prepareSave(): Promise<void>
}
export interface Datapack extends AnonymousDatapack{
    getImage(): Promise<string>
    getName(): Promise<string>
    getMcmeta(): Promise<PackMcmeta | undefined>
}

export namespace Datapack{
    function fromFileAccess(access: FileAccess): Promise<AnonymousDatapack | Datapack>{
        return new BasicDatapack(access).constructOverlay()
    }

    export function fromFileList(files: File[]): Promise<AnonymousDatapack | Datapack>{
        return fromFileAccess(new FileListFileAccess(files))
    }

    export async function fromZipFile(file: File): Promise<AnonymousDatapack |Datapack>{
        return await fromFileAccess(await ZipFileAccess.fromFile(file))
    }

    export async function fromZipUrl(url: string): Promise<AnonymousDatapack | Datapack>{
        return await fromFileAccess(await ZipFileAccess.fromUrl(url))
    }

    export function fromFileSystemDirectoryHandle(handle: FileSystemDirectoryHandle): Promise<AnonymousDatapack | Datapack>{
        return fromFileAccess(new FileSystemDirectoryFileAccess(handle))
    }

    export function compose(datapacks: DatapackList): AnonymousDatapack{
        return new CompositeDatapack(datapacks)
    }
}