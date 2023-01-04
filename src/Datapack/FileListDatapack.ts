import { Identifier } from "deepslate"
import stripJsonComments from "strip-json-comments"
import { DataType, JsonDataType } from "../DataType"
import { UNKOWN_PACK } from "../unkown_pack"
import { getFileType, idToPath } from "../util"
import { Datapack } from "./Datapack"

interface MyFile extends File{
    readonly webkitRelativePath: string;
}

export class FileListDatapack implements Datapack{
    private baseDirectoryName: string
    private directoryName: string
    private is_anonymous: boolean

    private files: MyFile[]

    constructor(
        files: File[],
        private parser: (str: string) => unknown = (str) => JSON.parse(stripJsonComments(str)),
    ){
        this.files = files.map(f => <MyFile>f)
        this.baseDirectoryName = this.files[0].webkitRelativePath.split("/")[0]

        this.is_anonymous = this.baseDirectoryName === "data"

        this.directoryName = this.baseDirectoryName + (this.is_anonymous ? "" : "/data")
    }

    async getImage(): Promise<string> {
        if (this.is_anonymous){
            return UNKOWN_PACK
        } else {
            const filename = this.baseDirectoryName + "/pack.png"
            const file = this.files.find(file => file.webkitRelativePath === filename)
            if (file){
                return URL.createObjectURL(file)
            } else {
                return UNKOWN_PACK
            }
        }
    }

    async getName(): Promise<string> {
        if (this.is_anonymous) {
            return "Imported data folder"
        } else {
            return this.baseDirectoryName === "" ? "Datapack loaded from folder" : this.baseDirectoryName
        }
    }

    async getMcmeta(): Promise<unknown> {
        if (this.is_anonymous){
            return {}
        } else {
            const filename = this.baseDirectoryName + "/pack.mcmeta"
            const file = this.files.find(file => file.webkitRelativePath === filename)
            if (file){
                return this.parser(await file.text())
            } else {
                return {}
            }
        }
    }

    async has(type: DataType, id: Identifier): Promise<boolean> {
        return this.files.findIndex(file => file.webkitRelativePath === this.directoryName + "/" + idToPath(type, id)) >= 0
    }

    async getIds(type: DataType): Promise<Identifier[]> {
        return this.files.flatMap(file => {
            const match = file.webkitRelativePath.match(this.directoryName + "/([^/]*)/" + type + "/(.*)")
            if (match && match.length == 3){
                return [new Identifier(match[1], match[2].substr(0, match[2].lastIndexOf(".")))]
            } else {
                return [] //flatMap will remove this element
            }
        })
    }

    async get(type: DataType, id: Identifier): Promise<ArrayBuffer | unknown> {
        const file = this.files.find(file => file.webkitRelativePath === this.directoryName + "/" + idToPath(type, id))
        if (!file)
            return undefined
        const fileType = getFileType(type)
        if (fileType == "json"){
            return this.parser(await file.text())
        } else {
            return await file.arrayBuffer()
        }
    }
}