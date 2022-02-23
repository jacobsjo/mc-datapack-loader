import { DataType } from "./DataType"

export function idToPath(type: DataType, id: string, ){
    const [namespace, name] = id.split(":", 2)
    const extension = type === "structures" ? "nbt" : "json"
    return namespace + "/" + type + "/" + name + "." + extension
}

export function getFileType(type: DataType): "nbt"|"json"{
    return type === "structures" ? "nbt" : "json"
}