import { DataType, JsonDataType } from "../DataType"
import { getFileType, idToPath } from "../util"
import { Datapack } from "./Datapack"

interface MyFile extends File{
    readonly webkitRelativePath: string;
}

export class FileListDatapack implements Datapack{
    private directoryName: string

    private files: MyFile[]

    constructor(
        files: File[]
    ){
        this.files = files.map(f => <MyFile>f)
        this.directoryName = this.files[0].webkitRelativePath.split("/")[0]
        if (this.directoryName !== "data"){
            this.directoryName += "/data"
        }
    }

    async has(type: DataType, id: string): Promise<boolean> {
        return this.files.findIndex(file => file.webkitRelativePath === this.directoryName + "/" + idToPath(type, id)) >= 0
    }

    async getIds(type: DataType): Promise<string[]> {
        return this.files.flatMap(file => {
            const match = file.webkitRelativePath.match(this.directoryName + "/([^/]*)/" + type + "/(.*)")
            if (match && match.length == 3){
                return match[1] + ":" + match[2].substr(0, match[2].lastIndexOf("."))
            } else {
                return [] //flatMap will remove this element
            }
        })
    }

    async get(type: DataType, id: string): Promise<(typeof type extends JsonDataType ? unknown : ArrayBuffer) | undefined> {
        console.log(this.directoryName)
        console.log(idToPath(type, id))
        const file = this.files.find(file => file.webkitRelativePath === this.directoryName + "/" + idToPath(type, id))
        if (!file)
            return undefined
        const fileType = getFileType(type)
        if (fileType == "json"){
            return JSON.parse(await file.text())
        } else {
            return await file.arrayBuffer()
        }
    }
}