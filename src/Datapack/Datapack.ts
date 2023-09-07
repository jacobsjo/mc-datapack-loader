import { Identifier } from "deepslate";
import { DataType } from "../DataType";
import { FileAccess } from "../FileAccess/FileAccess";
import { FileListFileAccess } from "../FileAccess/FileListFileAccess";
import { FileSystemDirectoryFileAccess } from "../FileAccess/FileSystemDirectoryFileAccess";
import { ZipFileAccess } from "../FileAccess/ZipFileAccess";
import { PackMcmeta } from "../packMcmeta";
import { BasicDatapack } from "./BasicDatapack";


export interface AnonymousDatapack {
    has(type: DataType, id: Identifier): Promise<boolean>
    getIds(type: DataType): Promise<Identifier[]>
    get(type: DataType, id: Identifier): Promise<unknown | ArrayBuffer>

    save?(type: DataType, id: Identifier, data: unknown | ArrayBuffer): Promise<boolean>
    prepareSave?(): Promise<void>
}
export interface Datapack extends AnonymousDatapack{
    getImage(): Promise<string>
    getName(): Promise<string>
    getMcmeta(): Promise<PackMcmeta | undefined>
}

export namespace Datapack{
    export function fromFileList(files: File[]): Promise<AnonymousDatapack | Datapack>{
        return fromFileAccess(Promise.resolve(new FileListFileAccess(files)))
    }

    export function fromZipFile(file: File): Promise<AnonymousDatapack |Datapack>{
        return fromFileAccess(ZipFileAccess.fromFile(file))
    }

    export function fromZipUrl(url: string): Promise<AnonymousDatapack | Datapack>{
        return fromFileAccess(ZipFileAccess.fromUrl(url))
    }

    export function fromFileSystemDirectoryHandle(handle: FileSystemDirectoryHandle): Promise<AnonymousDatapack | Datapack>{
        return fromFileAccess(Promise.resolve(new FileSystemDirectoryFileAccess(handle)))
    }

    function fromFileAccess(access: Promise<FileAccess>): Promise<AnonymousDatapack | Datapack>{
        return new BasicDatapack(access).constructOverlay()
    }
}