import { Identifier } from "deepslate";
import { DataType } from "../DataType";
import { FileListFileAccess } from "../FileAccess/FileListFileAccess";
import { FileSystemDirectoryFileAccess } from "../FileAccess/FileSystemDirectoryFileAccess";
import { ZipFileAccess } from "../FileAccess/ZipFileAccess";
import { BasicDatapack } from "./BasicDatapack";

export interface Datapack {
    getImage(base64?: boolean): Promise<string>
    getName(): Promise<string>
    getMcmeta(): Promise<unknown>

    has(type: DataType, id: Identifier): Promise<boolean>
    getIds(type: DataType): Promise<Identifier[]>
    get(type: DataType, id: Identifier): Promise<unknown | ArrayBuffer>

    save?(type: DataType, id: Identifier, data: unknown | ArrayBuffer): Promise<boolean>
    prepareSave?(): Promise<void>
}

export namespace Datapack{
    export function fromFileList(files: File[]){
        return new BasicDatapack(Promise.resolve(new FileListFileAccess(files)))
    }

    export function fromZipFile(file: File){
        return new BasicDatapack(ZipFileAccess.fromFile(file))
    }

    export function fromZipUrl(url: string){
        return new BasicDatapack(ZipFileAccess.fromUrl(url))
    }

    export function fromFileSystemDirectoryHandle(handle: FileSystemDirectoryHandle){
        return new BasicDatapack(Promise.resolve(new FileSystemDirectoryFileAccess(handle)))
    }
}