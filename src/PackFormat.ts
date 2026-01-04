

export class PackFormat {
    constructor(
        public readonly major: number,
        public readonly minor: number = 0
    ) { }

    public static fromJson(json: unknown, minor: number = 0){
        if (typeof json === 'number'){
            return new PackFormat(Math.floor(json), minor)
        } else if (Array.isArray(json)) {
            return new PackFormat(json[0], json?.[1] ?? minor)
        } else {
            return new PackFormat(-1, 0)
        }
    }

    public compare(other: PackFormat){
        if (this.major < other.major) return 1
        if (this.major === other.major) return other.minor - this.minor
        return -1
    }
}