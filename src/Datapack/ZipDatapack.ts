import { Identifier } from "deepslate";
import jszip from "jszip";
import stripJsonComments from "strip-json-comments";
import { DataType } from "../DataType";
import { getFileType, idToPath } from "../util";
import { Datapack } from "./Datapack";


export class ZipDatapack implements Datapack{
    private datapackName: string

    constructor(
        private zip: jszip,
        private parser: (str: string) => unknown = (str) => JSON.parse(stripJsonComments(str))
    ){
        this.datapackName = Object.keys(zip.files).find(n => n.indexOf("/") > 0)?.split("/")[0] + "/"
        if (this.datapackName !== "data/"){
            this.datapackName += "data/"
        }
    }

    public static async fromFile(
        file: File,
        parser: (str: string) => unknown = (str) => JSON.parse(stripJsonComments(str))
    ){
        const data = await file.arrayBuffer()
        const zip = await jszip.loadAsync(data)
        return new ZipDatapack(zip, parser)
    }

    public static async fromUrl(
        url: string,
        parser: (str: string) => unknown = (str) => JSON.parse(stripJsonComments(str))
    ){
        const data = await (await fetch(url)).arrayBuffer()
        const zip = await jszip.loadAsync(data)
        return new ZipDatapack(zip, parser)
    }

    async has(type: DataType, id: Identifier): Promise<boolean> {
        const has = this.zip.file(this.datapackName + idToPath(type, id)) !== null
        return this.zip.file(this.datapackName + idToPath(type, id)) !== null
    }

    async getIds(type: DataType): Promise<Identifier[]> {
        const fileType = getFileType(type)
        return Object.keys(this.zip.files).flatMap(file => {
            const match = file.match(`${this.datapackName}([^/]*)/${type}/(.*\.${fileType})`)
            if (match && match.length == 3){
                return [new Identifier(match[1], match[2].substr(0, match[2].lastIndexOf(".")))]
            } else {
                return [] //flatMap will remove this element
            }
        })
    }

    async get(type: DataType, id: Identifier): Promise<unknown | ArrayBuffer> {
        const file = this.zip.files[this.datapackName + idToPath(type, id)]
        if (!file)
            return undefined
            
        const fileType = getFileType(type)
        if (fileType == "json"){
            return this.parser(await file.async("string"))
        } else {
            return await file.async("arraybuffer")
        }
    }

}