import { CommentJSONValue, parse } from "comment-json";
import jszip from "jszip";
import { DataType } from "../DataType";
import { getFileType, idToPath } from "../util";
import { Datapack } from "./Datapack";


export class ZipDatapack implements Datapack{
    private datapackName: string

    constructor(
        private zip: jszip
    ){
        this.datapackName = Object.keys(zip.files).find(n => n.indexOf("/") > 0)?.split("/")[0] + "/"
        if (this.datapackName !== "data/"){
            this.datapackName += "data/"
        }
    }

    public static async fromFile(file: File){
        const data = await file.arrayBuffer()
        const zip = await jszip.loadAsync(data)
        return new ZipDatapack(zip)
    }

    public static async fromUrl(url: string){
        const data = await (await fetch(url)).arrayBuffer()
        const zip = await jszip.loadAsync(data)
        return new ZipDatapack(zip)
    }

    async has(type: DataType, id: string): Promise<boolean> {
        const has = this.zip.file(this.datapackName + idToPath(type, id)) !== null
        return this.zip.file(this.datapackName + idToPath(type, id)) !== null
    }

    async getIds(type: DataType): Promise<string[]> {
        const fileType = getFileType(type)
        return Object.keys(this.zip.files).flatMap(file => {
            const match = file.match(`${this.datapackName}([^/]*)/${type}/(.*\.${fileType})`)
            if (match && match.length == 3){
                return match[1] + ":" + match[2].substr(0, match[2].lastIndexOf("."))
            } else {
                return [] //flatMap will remove this element
            }
        })
    }

    async get(type: DataType, id: string): Promise<CommentJSONValue | unknown | ArrayBuffer> {
        const file = this.zip.files[this.datapackName + idToPath(type, id)]
        if (!file)
            return undefined
            
        const fileType = getFileType(type)
        if (fileType == "json"){
            return parse(await file.async("string"))
        } else {
            return await file.async("arraybuffer")
        }
    }

}