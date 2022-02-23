import { DataType, JsonDataType, NbtDataType } from "../DataType";

export interface Datapack{
    has(type: DataType, id: string): Promise<boolean>
    getIds(type: DataType): Promise<string[]>
    get(type: DataType, id: string): Promise<(typeof type extends JsonDataType ? unknown : ArrayBuffer) | undefined>

    save?(type: DataType, id: string, data: typeof type extends JsonDataType ? unknown : ArrayBuffer): Promise<void>
}