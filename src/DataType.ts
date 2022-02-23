

export type JsonDataType =
    "advancements" |
    "dimension" | 
    "dimension_type" | 
    "loot_tables" | 
    "recipes" | 
    "tags/blocks" | 
    "tags/entity_types" | 
    "tags/fluids" | 
    "tags/game_events" | 
    "tags/items" | 
    "tags/worldgen/biome" | 
    "tags/worldgen/configured_structure_feature" | 
    "worldgen/biome" | 
    "worldgen/configured_carver" | 
    "worldgen/configured_feature" | 
    "worldgen/configured_structure_feature" | 
    "worldgen/density_function" | 
    "worldgen/noise" | 
    "worldgen/noise_settings" | 
    "worldgen/placed_feature" | 
    "worldgen/processor_list" |
    "worldgen/structure_set" |
    "worldgen/template_pool"

export type NbtDataType =
    "structures"

export type DataType = JsonDataType | NbtDataType