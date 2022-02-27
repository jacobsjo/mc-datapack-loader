import { CommentJSONValue } from "comment-json";
import { DataType, JsonDataType, NbtDataType } from "../DataType";

export interface Datapack{
    has(type: DataType, id: string): Promise<boolean>
    getIds(type: DataType): Promise<string[]>
    get(type: DataType, id: string): Promise<CommentJSONValue | unknown | ArrayBuffer>

    save?(type: DataType, id: string, data: unknown | CommentJSONValue | ArrayBuffer): Promise<boolean>
    prepareSave?(): Promise<void>
}