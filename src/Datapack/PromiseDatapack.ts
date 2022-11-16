import { Identifier } from "deepslate";
import { DataType } from "../DataType";
import { Datapack } from "./Datapack";



export class PromiseDatapack implements Datapack{
    constructor(private promise: Promise<Datapack>){}

    async getImage(): Promise<string> {
        return (await this.promise).getImage()
    }

    async getName(): Promise<string> {
        return (await this.promise).getName()
    }

    async getMcmeta(): Promise<unknown> {
        return (await this.promise).getMcmeta()
    }

    async has(type: DataType, id: Identifier): Promise<boolean> {
        return (await this.promise).has(type, id)
    }
    
    async getIds(type: DataType): Promise<Identifier[]> {
        return (await this.promise).getIds(type)
    }
    
    async get(type: DataType, id: Identifier): Promise<unknown> {
        return (await this.promise).get(type, id)
    }

}