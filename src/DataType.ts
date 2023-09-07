


export namespace DataType {
    export type Path = keyof typeof PATH_PROPERTIES

    interface Properties {
        reader: "json" | "arraybuffer",
        fileExtension: string,
        merging: "override" | "tags" | "assign"
    }

    const SPECIAL: Properties = {reader: "json", fileExtension: "json", merging: "assign"}
    const NORMAL_JSON: Properties = {reader: "json", fileExtension: "json", merging: "override"}
    const TAGS: Properties = {reader: "json", fileExtension: "json", merging: "tags"}
    const NBT: Properties = {reader: "arraybuffer", fileExtension: "nbt", merging: "override"}

    export const PATH_PROPERTIES = {
        "": SPECIAL,

        "advancements": NORMAL_JSON, 
        "dimension": NORMAL_JSON,  
        "dimension_type": NORMAL_JSON,  
        "loot_tables": NORMAL_JSON,  
        "recipes": NORMAL_JSON, 
        "chat_type": NORMAL_JSON, 
        "damage_type": NORMAL_JSON, 
        "worldgen/biome": NORMAL_JSON,  
        "worldgen/configured_carver": NORMAL_JSON,  
        "worldgen/configured_feature": NORMAL_JSON,  
        "worldgen/density_function": NORMAL_JSON,  
        "worldgen/flat_level_generator_preset": NORMAL_JSON, 
        "worldgen/noise": NORMAL_JSON,  
        "worldgen/noise_settings": NORMAL_JSON,  
        "worldgen/placed_feature": NORMAL_JSON,  
        "worldgen/processor_list": NORMAL_JSON, 
        "worldgen/structure": NORMAL_JSON, 
        "worldgen/structure_set": NORMAL_JSON, 
        "worldgen/template_pool": NORMAL_JSON, 
        "worldgen/world_preset": NORMAL_JSON, 
        "worldgen/multi_noise_biome_source_parameter_list": NORMAL_JSON, 
        "worldgen/configured_structure_feature": NORMAL_JSON, 

        "tags/banner_pattern": TAGS,
        "tags/blocks": TAGS, 
        "tags/cat_variant": TAGS,
        "tags/damage_type": TAGS,
        "tags/entity_types": TAGS, 
        "tags/fluids": TAGS, 
        "tags/game_events": TAGS,
        "tags/instrument": TAGS, 
        "tags/items": TAGS, 
        "tags/painting_variant": TAGS,
        "tags/point_of_interest_type": TAGS,
        "tags/worldgen/biome": TAGS, 
        "tags/worldgen/flat_level_generator_preset": TAGS,
        "tags/worldgen/structure": TAGS,
        "tags/worldgen/world_preset": TAGS,
        "tags/worldgen/configured_carver": TAGS,
        "tags/worldgen/configured_feature": TAGS,
        "tags/worldgen/configured_structure_feature": TAGS, 

        "structures": NBT
    }


}


