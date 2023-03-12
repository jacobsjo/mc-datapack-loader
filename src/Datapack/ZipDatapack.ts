import { Identifier } from "deepslate";
import jszip from "jszip";
import stripJsonComments from "strip-json-comments";
import { DataType } from "../DataType";
import { UNKOWN_PACK } from "../unkown_pack";
import { getFileType, idToPath } from "../util";
import { Datapack } from "./Datapack";


export class ZipDatapack implements Datapack{

    constructor(
        private zip: jszip,
        private datapackName: string = "",
        private parser: (str: string) => unknown = (str) => JSON.parse(stripJsonComments(str))
    ){
    }

    async getImage(): Promise<string> {
        const file = this.zip.file("pack.png")
        if (file){
            return "data:image/png;base64," + (await file.async("base64"))
        } else {
            return UNKOWN_PACK
        }
    }

    async getName(): Promise<string> {
        return this.datapackName
    }

    async getMcmeta(): Promise<unknown> {
        const file = this.zip.file("pack.mcmeta")
        if (file){
            return this.parser(await file.async("string"))
        } else {
            return {}
        }
    }

    public static async fromFile(
        file: File,
        parser: (str: string) => unknown = (str) => JSON.parse(stripJsonComments(str))
    ){
        const data = await file.arrayBuffer()
        const zip = await jszip.loadAsync(data)
        return new ZipDatapack(zip, file.name, parser)
    }

    public static async fromUrl(
        url: string,
        name?: string,
        parser: (str: string) => unknown = (str) => JSON.parse(stripJsonComments(str))
    ){
        const data = await (await fetch(url)).arrayBuffer()
        const zip = await jszip.loadAsync(data)
        return new ZipDatapack(zip, name ?? url, parser)
    }

    async has(type: DataType, id: Identifier): Promise<boolean> {
        const has = this.zip.file("data/" + idToPath(type, id)) !== null
        return this.zip.file("data/" + idToPath(type, id)) !== null
    }

    async getIds(type: DataType): Promise<Identifier[]> {
        const fileType = getFileType(type)
        return Object.keys(this.zip.files).flatMap(file => {
            const match = file.match(type === ""
                ? `^data/([^/]*)/([^/]*\.json)`
                : `^data/([^/]*)/${type}/(.*\.${fileType})`)
            if (match && match.length == 3){
                return [new Identifier(match[1], match[2].substr(0, match[2].lastIndexOf(".")))]
            } else {
                return [] //flatMap will remove this element
            }
        })
    }

    async get(type: DataType, id: Identifier): Promise<unknown | ArrayBuffer> {
        const file = this.zip.files["data/" + idToPath(type, id)]
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