import { Identifier } from "deepslate"
import { DataType } from "./DataType"

export function idToPath(type: DataType, id: Identifier ){
    const extension = type === "structures" ? "nbt" : "json"
    return id.namespace + "/" + type + "/" + id.path + "." + extension
}

export function getFileType(type: DataType): "nbt"|"json"{
    return type === "structures" ? "nbt" : "json"
}
