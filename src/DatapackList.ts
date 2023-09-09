import { AnonymousDatapack } from "./main";

export interface DatapackList {
    getDatapacks(): Promise<AnonymousDatapack[]>
}

export namespace DatapackList{
    export const EMPTY = new class implements DatapackList{
        async getDatapacks(): Promise<AnonymousDatapack[]> {
            return []
        }
    }
}