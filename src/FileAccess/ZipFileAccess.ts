import { FileAccess } from "./FileAccess";
import jszip, { file } from "jszip";

export class ZipFileAccess implements FileAccess{

    constructor(
        private zip: jszip,
    ){

    }

    public static async fromFile(
        file: File,
    ){
        const data = await file.arrayBuffer()
        const zip = await jszip.loadAsync(data)
        return new ZipFileAccess(zip)
    }

    public static async fromUrl(
        url: string,
    ){
        const data = await (await fetch(url)).arrayBuffer()
        const zip = await jszip.loadAsync(data)
        return new ZipFileAccess(zip)
    }

    async getAllFiles(path: string): Promise<string[]> {
        if (path.length > 0 && !path.endsWith("/")) path = path + "/"
        return Object.keys(this.zip.files).filter(p => p.startsWith(path)).filter(p => p.startsWith(path)).map(p => p.substring(path.length))
    }

    async getSubfolders(path: string): Promise<string[]> {
        return [...new Set((await this.getAllFiles(path)).map(p => p.split("/")[0]))]
    }

    async has(path: string): Promise<boolean> {
        return this.zip.file(path) !== null
    }

    readFile(path: string, type: "string"): Promise<string | undefined>;
    readFile(path: string, type: "arraybuffer"): Promise<ArrayBuffer | undefined>;
    async readFile(path: string, type: "arraybuffer" | "string"): Promise<string | ArrayBuffer | undefined> {
        return this.zip.file(path)?.async(type)
    }
}