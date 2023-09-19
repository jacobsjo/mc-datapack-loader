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
import { OverlaiedDatapack } from "./OverlaiedDatapack";
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
    getFilename(): Promise<string>
    getImage(): Promise<string>
    getMcmeta(): Promise<PackMcmeta | undefined>

    setPackVersion(version: number): Promise<void>
}

export namespace Datapack{
    function fromFileAccess(access: FileAccess | Promise<FileAccess>, packVersion: number): Datapack{
        return new PromiseDatapack(new Promise(async (resolve) => resolve(createOverlay(new BasicDatapack(await access), packVersion))))
    }

    function createOverlay(basePack: BasicDatapack, packVersion: number): OverlaiedDatapack{
        return new OverlaiedDatapack(basePack,  packVersion)
    }

    export function fromFileList(files: File[], packVersion: number): Datapack{
        return fromFileAccess(new FileListFileAccess(files), packVersion)
    }

    export function fromZipFile(file: File, packVersion: number): Datapack{
        return fromFileAccess(ZipFileAccess.fromFile(file), packVersion)
    }

    export function fromZipUrl(url: string, packVersion: number): Datapack{
        return fromFileAccess(ZipFileAccess.fromUrl(url), packVersion)
    }

    export function fromFileSystemDirectoryHandle(handle: FileSystemDirectoryHandle, packVersion: number): Datapack{
        return fromFileAccess(new FileSystemDirectoryFileAccess(handle), packVersion)
    }

    export function compose(datapacks: DatapackList): AnonymousDatapack{
        return new CompositeDatapack(datapacks)
    }
}