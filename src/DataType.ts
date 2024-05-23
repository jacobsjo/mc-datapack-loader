


export class ResourceLocation {

    constructor(
        public type: "data" | "assets",
        public location: string,
        public reader: "json" | "arraybuffer" = "json",
        public fileExtension: string = "json",
        public merging: "override" | "tags" | "assign" = "override"
    ) {
    }

    public static JSON_DATA(location: string, merging: "override" | "tags" | "assign" = "override") {
        return new ResourceLocation("data", location, "json", "json", merging)
    }

    public static JSON_ASSETS(location: string, merging: "override" | "tags" | "assign" = "override") {
        return new ResourceLocation("assets", location, "json", "json", merging)
    }


    public static JSON_TAG_DATA(location: string) {
        return new ResourceLocation("data", `tags/${location}`, "json", "json", "tags")
    }

    public static readonly DATA_FILE = new ResourceLocation("data", "", "json", "json", "assign")
    public static readonly ADVANCEMENT = this.JSON_DATA("advancement")
    public static readonly DIMENSION = this.JSON_DATA("dimension")
    public static readonly DIMENSION_TYPE = this.JSON_DATA("dimension_type")
    public static readonly LOOT_TABLE = this.JSON_DATA("loot_table")
    public static readonly RECIPE = this.JSON_DATA("recipe")
    public static readonly PREDICATE = this.JSON_DATA("predicate")
    public static readonly ITEM_MODIFIER = this.JSON_DATA("item_modifier")

    public static readonly CHAT_TYPE = this.JSON_DATA("chat_type")
    public static readonly DAMAGE_TYPE = this.JSON_DATA("damage_type")
    public static readonly WORLDGEN_BIOME = this.JSON_DATA("worldgen/biome")
    public static readonly WORLDGEN_CONFIGURED_CARVER = this.JSON_DATA("worldgen/configured_carver")
    public static readonly WORLDGEN_CONFIGURED_FEATURE = this.JSON_DATA("worldgen/configured_feature")
    public static readonly WORLDGEN_DENSITY_FUNCTION = this.JSON_DATA("worldgen/density_function")
    public static readonly WORLDGEN_FLAT_LEVEL_GENERATOR_PRESET = this.JSON_DATA("worldgen/flat_level_generator_preset")
    public static readonly WORLDGEN_NOISE = this.JSON_DATA("worldgen/noise")
    public static readonly WORLDGEN_NOISE_SETTINGS = this.JSON_DATA("worldgen/noise_settings")
    public static readonly WORLDGEN_PLACED_FEATURE = this.JSON_DATA("worldgen/placed_feature")
    public static readonly WORLDGEN_PROCESSOR_LIST = this.JSON_DATA("worldgen/processor_list")
    public static readonly WORLDGEN_STRUCTURE = this.JSON_DATA("worldgen/structure")
    public static readonly WORLDGEN_STRUCTURE_SET = this.JSON_DATA("worldgen/structure_set")
    public static readonly WORLDGEN_TEMPLATE_POOL = this.JSON_DATA("worldgen/template_pool")
    public static readonly WORLDGEN_WORLD_PRESET = this.JSON_DATA("worldgen/world_preset")
    public static readonly WORLDGEN_MULTI_NOISE_BIOME_SOURCE_PRARAMETER_LIST = this.JSON_DATA("worldgen/multi_noise_biome_source_parameter_list")

    public static readonly BANNER_PATTERN_TAG = this.JSON_TAG_DATA("banner_pattern")
    public static readonly BLOCK_TAG = this.JSON_TAG_DATA("block")
    public static readonly CAT_VARIANT_TAG = this.JSON_TAG_DATA("cat_variant")
    public static readonly DAMAGE_TYPE_TAG = this.JSON_TAG_DATA("damage_type")
    public static readonly ENTITY_TYPE_TAG = this.JSON_TAG_DATA("entity_type")
    public static readonly FLUID_TAG = this.JSON_TAG_DATA("fluid")
    public static readonly GAME_EVENT_TAG = this.JSON_TAG_DATA("game_event")
    public static readonly INSTRUMENT_TAG = this.JSON_TAG_DATA("instrument")
    public static readonly ITEM_TAG = this.JSON_TAG_DATA("item")
    public static readonly PAINING_VARIANT_TAG = this.JSON_TAG_DATA("painting_variant")
    public static readonly POINT_OF_INTEREST_TYPE_TAG = this.JSON_TAG_DATA("point_of_interest_type")
    public static readonly WORLDGEN_BIOME_TAG = this.JSON_TAG_DATA("worldgen/biome")
    public static readonly WORLDGEN_FLAT_LEVEL_GENERATOR_PRESET_TAG = this.JSON_TAG_DATA("worldgen/flat_level_generator_preset")
    public static readonly WORLDGEN_STRUCTURE_TAG = this.JSON_TAG_DATA("worldgen/structure")
    public static readonly WORLDGEN_WORLD_PRESET_TAG = this.JSON_TAG_DATA("worldgen/world_preset")
    public static readonly WORLDGEN_CONFIGURED_CARVER_TAG = this.JSON_TAG_DATA("worldgen/configured_carver")
    public static readonly WORLDGEN_CONFIGURED_FEATURE_TAG = this.JSON_TAG_DATA("worldgen/configured_feature")

    public static readonly STRUCTURE = new ResourceLocation("data", "structure", "arraybuffer", "nbt", "override")

    public static readonly LANGUAGE = this.JSON_ASSETS("lang", "assign")

    /**
     * @deprecated For old version of Minecraft only
     */
    public static readonly LEGACY_LOOT_TABLE = this.JSON_DATA("loot_tables")
    public static readonly LEGACY_ADVANCEMENT = this.JSON_DATA("advancements")
    public static readonly LEGACY_RECIPE = this.JSON_DATA("recipes")
    public static readonly LEGACY_PREDICATE = this.JSON_DATA("predicates")
    public static readonly LEGACY_ITEM_MODIFIER = this.JSON_DATA("item_modifiers")
    public static readonly LEGACY_STRUCTURE = new ResourceLocation("data", "structures", "arraybuffer", "nbt", "override")
    public static readonly LEGACY_WORLDGEN_CONFIGURED_STRUCTURE_FEATURE = this.JSON_DATA("worldgen/configured_structure_feature")
    public static readonly LEGACY_WORLDGEN_CONFIGURED_STRUCTURE_FEATURE_TAG = this.JSON_TAG_DATA("worldgen/configured_structure_feature")
    public static readonly LEGACY_BLOCK_TAG = this.JSON_TAG_DATA("blocks")
    public static readonly LEGACY_FLUID_TAG = this.JSON_TAG_DATA("fluids")
    public static readonly LEGACY_ITEM_TAG = this.JSON_TAG_DATA("items")
    public static readonly LEGACY_ENTITY_TYPE_TAG = this.JSON_TAG_DATA("entity_types")
    public static readonly LEGACY_GAME_EVENT_TAG = this.JSON_TAG_DATA("game_events")

}

