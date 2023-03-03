

export type JsonDataType =
    "" |
    "advancements" |
    "dimension" | 
    "dimension_type" | 
    "loot_tables" | 
    "recipes" |
    "chat_type" |
    "damage_type" |
    "tags/banner_pattern" |
    "tags/blocks" | 
    "tags/cat_variant" |
    "tags/damage_type" |
    "tags/entity_types" | 
    "tags/fluids" | 
    "tags/game_events" |
    "tags/instrument" | 
    "tags/items" | 
    "tags/painting_variant" |
    "tags/point_of_interest_type" |
    "tags/worldgen/biome" | 
    "tags/worldgen/flat_level_generator_preset" |
    "tags/worldgen/structure" |
    "tags/worldgen/world_preset" |
    "tags/worldgen/configured_carver" |
    "tags/worldgen/configured_feature" |
    "tags/worldgen/configured_structure_feature" | 
    "worldgen/biome" | 
    "worldgen/configured_carver" | 
    "worldgen/configured_feature" | 
    "worldgen/density_function" | 
    "worldgen/flat_level_generator_preset" |
    "worldgen/noise" | 
    "worldgen/noise_settings" | 
    "worldgen/placed_feature" | 
    "worldgen/processor_list" |
    "worldgen/structure" |
    "worldgen/structure_set" |
    "worldgen/template_pool" |
    "worldgen/world_preset" |
    "worldgen/multi_noise_biome_source_parameter_list" |
    "worldgen/configured_structure_feature"


export type NbtDataType =
    "structures"

export type DataType = JsonDataType | NbtDataType