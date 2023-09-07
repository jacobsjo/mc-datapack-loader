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
import { PromiseDatapack } from "./PromiseDatapack";


export interface AnonymousDatapack {
    has(type: DataType.Path, id: Identifier): Promise<boolean>
    getIds(type: DataType.Path): Promise<Identifier[]>
    get(type: DataType.Path, id: Identifier): Promise<unknown | ArrayBuffer>

    canSave(): Promise<boolean>
    save(type: DataType.Path, id: Identifier, data: unknown | ArrayBuffer): Promise<boolean>
    prepareSave(): Promise<void>
}
export interface Datapack extends AnonymousDatapack{
    getImage(): Promise<string>
    getMcmeta(): Promise<PackMcmeta | undefined>
}

export namespace Datapack{
    function fromFileAccess(access: FileAccess | Promise<FileAccess>): Datapack{
        return new PromiseDatapack(new Promise(async (resolve) => resolve(new BasicDatapack(await access).constructOverlay())))
    }

    export function fromFileList(files: File[]): Datapack{
        return fromFileAccess(new FileListFileAccess(files))
    }

    export function fromZipFile(file: File): Datapack{
        return fromFileAccess(ZipFileAccess.fromFile(file))
    }

    export function fromZipUrl(url: string): Datapack{
        return fromFileAccess(ZipFileAccess.fromUrl(url))
    }

    export function fromFileSystemDirectoryHandle(handle: FileSystemDirectoryHandle): Datapack{
        return fromFileAccess(new FileSystemDirectoryFileAccess(handle))
    }

    export function compose(datapacks: DatapackList): AnonymousDatapack{
        return new CompositeDatapack(datapacks)
    }
}