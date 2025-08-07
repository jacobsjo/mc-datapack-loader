import { PackFormat } from "./PackFormat"

type BlockPattern = {
    namespace: string,
    path: string
}

type LegacyFormatRange = number | [number, number] | {min_inclusive: number, max_inclusive: number}

type RawOverlay = {
    formats?: LegacyFormatRange,
    directory: string
    min_format?: PackFormat,
    max_format?: PackFormat
}


type PackMetadata = {
    pack_format?: number,
    description: unknown,
    supported_formats?: LegacyFormatRange,
    min_format?: PackFormat,
    max_format?: PackFormat
}

type RawPackMcmeta = {
    pack: PackMetadata,
    filter? :{
        block: BlockPattern[]
    }
    features?: {
        enabled: string[]
    }
    overlays?: {
        entries: RawOverlay[]
    }
}

type FormatRange = {min: PackFormat, max: PackFormat}

export class PackMcmeta {

    constructor(
        public readonly description: unknown,
        public readonly formats: FormatRange,
        public readonly overlays: Overlay[],
        public readonly filter? :{
            block: BlockPattern[]
        },
        public readonly features?: {
            enabled: string[]
        },
    ) {

    }

    public static fromJson(json: unknown) {
        const raw = json as RawPackMcmeta

        return new PackMcmeta(
            raw.pack.description,
            PackMcmeta.parseRange(raw.pack),
            raw.overlays?.entries?.map(overlay => Overlay.fromJson(overlay)) ?? [],
            raw.filter,
            raw.features
        )
    }

    static parseRange(obj: RawOverlay | PackMetadata): FormatRange{
        if (obj.min_format && obj.max_format) {
            return {min: PackFormat.fromJson(obj.min_format), max: PackFormat.fromJson(obj.max_format, Number.MAX_SAFE_INTEGER)}
        }

        const formats = (obj as any).formats ?? (obj as any).supported_formats

        if (typeof formats === 'number') {
            return {min: new PackFormat(formats, 0), max: new PackFormat(formats, Number.MAX_SAFE_INTEGER)}
        } else if (Array.isArray(formats)){
            return {min: new PackFormat(formats[0], 0), max: new PackFormat(formats[1], Number.MAX_SAFE_INTEGER)}
        } else if (formats !== undefined) {
            return {min: new PackFormat(formats.min_inclusive, 0), max: new PackFormat(formats.max_inclusive, Number.MAX_SAFE_INTEGER)}
        }

        if ((obj as any).pack_format !== undefined) {
            return {min: new PackFormat((obj as any).pack_format, 0), max: new PackFormat((obj as any).pack_format, 0)}
        }

        throw new Error("can't parse format range")
    }

    static MatchFormatRange(range: FormatRange, format: PackFormat): boolean{
        if (range.min.compare(format) < 0) return false
        if (range.max.compare(format) > 0) return false
        return true
    }
}
class Overlay {
    constructor(
        public readonly directory: string,
        public readonly formats: FormatRange
    ){ }

    public static fromJson(json: RawOverlay) {
        return new Overlay(json.directory, PackMcmeta.parseRange(json))
    }
}

