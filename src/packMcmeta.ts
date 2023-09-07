


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