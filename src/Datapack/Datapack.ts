import { Identifier } from "deepslate";
import { DataType, JsonDataType, NbtDataType } from "../DataType";

export interface Datapack{
    has(type: DataType, id: Identifier): Promise<boolean>
    getIds(type: DataType): Promise<Identifier[]>
    get(type: DataType, id: Identifier): Promise<unknown | ArrayBuffer>

    save?(type: DataType, id: Identifier, data: unknown | ArrayBuffer): Promise<boolean>
    prepareSave?(): Promise<void>
}