


type BlockPattern = {
    namespace: string,
    path: string
}

type FormatRange = number | [number, number] | {min_inclusive: number, max_inclusive: number}

type Overlay = {
    formats: FormatRange,
    directory: string
}

export type PackMcmeta = {
    pack: {
        pack_format: number,
        description: unknown,
        supported_formats?: FormatRange
    },
    filter? :{
        block: BlockPattern[]
    }
    features?: {
        enabled: string[]
    }
    overlays?: {
        entries: Overlay[]
    }
}

export namespace PackMcmeta {
    export function MatchFormatRange(range: FormatRange, version: number): boolean{
        if (typeof range === "number"){
            return range === version
        } else if (Array.isArray(range)){
            return version >= range[0] && version <= range[1]
        } else {
            return version >= range.min_inclusive && version <= range.max_inclusive
        }
    }
}