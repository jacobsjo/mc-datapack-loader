import jszip from "jszip";
import { DataType } from "../DataType";
import { Datapack } from "./Datapack";


export class ZipDatapack implements Datapack{

    constructor(
        private zip: jszip
    ){}


    async has(type: DataType, id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async getIds(type: DataType): Promise<string[]> {
        throw new Error("Method not implemented.");
    }

    async get(type: DataType, id: string): Promise<ArrayBuffer | undefined> {
        throw new Error("Method not implemented.");
    }

}