// Shared location and item definitions for systems that use the world map.
// Keep map identity and cross-skill location data here; skill-specific tuning belongs
// in ExplorationConfig, CombatConfig or other systems that consume these areas.

export const WORLD_DATA = {
    id: "world:known_world",
    name: "The Known World",

    map: {
        type: "hex",
        coordinateSystem: "axial",
        startingAreaId: "area:the_crossroads",
    },

    // Provisional item definitions for the initial world. These can be registered
    // in itemData once the area rewards and item values have been reviewed.
    items: [
        // Exploration resources.
        { id: "item:crossroads_field_notes", variant: "exploration", type: "resource" },
        { id: "item:mossbound_ore", variant: "earth", type: "resource" },
        { id: "item:whispering_seeds", variant: "air", type: "resource" },
        { id: "item:stillwater_reeds", variant: "water", type: "resource" },

        // Companion container IDs carry their tier suffix, just like catalysts.
        { id: "item:earth_geode_i", variant: "earth", type: "companionContainer" },
        { id: "item:air_egg_i", variant: "air", type: "companionContainer" },
        { id: "item:water_shell_i", variant: "water", type: "companionContainer" },

        // Area artifacts are intended for Combat and Unveiling.
        { id: "item:crossroads_waystone", variant: "exploration", type: "artifact" },
        { id: "item:mossbound_heartstone", variant: "earth", type: "artifact" },
        { id: "item:whispering_chime", variant: "air", type: "artifact" },
        { id: "item:stillwater_idol", variant: "water", type: "artifact" },
    ],

    areas: [
        {
            id: "area:the_crossroads",
            actionId: "action:explore_the_crossroads",
            name: "The Crossroads",
            description: "A quiet neutral meeting point where the first paths through the world converge.",
            element: null,
            tier: 1,
            areaNumber: 1,
            position: { q: 0, r: 0 },
            connections: [
                "area:mossbound_foothills",
                "area:whispering_fields",
                "area:stillwater_pools",
            ],
            unlockedByDefault: true,
            exploration: {
                resourceRewards: [{ item: "item:crossroads_field_notes", amount: 1 }],
                companionContainer: null,
            },
            combat: {
                artifactItem: "item:crossroads_waystone",
            },
        },
        {
            id: "area:mossbound_foothills",
            actionId: "action:explore_mossbound_foothills",
            name: "The Mossbound Foothills",
            description: "Rolling green slopes hide old stone, rich seams and traces of deep-rooted magic.",
            element: "earth",
            tier: 1,
            areaNumber: 2,
            position: { q: -1, r: 0 },
            connections: ["area:the_crossroads"],
            unlockedByDefault: true,
            exploration: {
                resourceRewards: [{ item: "item:mossbound_ore", amount: 1 }],
                companionContainer: {
                    item: "item:earth_geode_i",
                    baseChance: 0.01,
                    minimumUnveilingSkillLevel: 1,
                },
            },
            combat: {
                artifactItem: "item:mossbound_heartstone",
            },
        },
        {
            id: "area:whispering_fields",
            actionId: "action:explore_whispering_fields",
            name: "The Whispering Fields",
            description: "Open grasslands carry strange winds and scatter seeds touched by the air.",
            element: "air",
            tier: 1,
            areaNumber: 3,
            position: { q: 1, r: -1 },
            connections: ["area:the_crossroads"],
            unlockedByDefault: true,
            exploration: {
                resourceRewards: [{ item: "item:whispering_seeds", amount: 1 }],
                companionContainer: {
                    item: "item:air_egg_i",
                    baseChance: 0.01,
                    minimumUnveilingSkillLevel: 1,
                },
            },
            combat: {
                artifactItem: "item:whispering_chime",
            },
        },
        {
            id: "area:stillwater_pools",
            actionId: "action:explore_stillwater_pools",
            name: "The Stillwater Pools",
            description: "Sheltered pools gather clear water, soft reeds and quiet traces of elemental life.",
            element: "water",
            tier: 1,
            areaNumber: 4,
            position: { q: 0, r: 1 },
            connections: ["area:the_crossroads"],
            unlockedByDefault: true,
            exploration: {
                resourceRewards: [{ item: "item:stillwater_reeds", amount: 1 }],
                companionContainer: {
                    item: "item:water_shell_i",
                    baseChance: 0.01,
                    minimumUnveilingSkillLevel: 1,
                },
            },
            combat: {
                artifactItem: "item:stillwater_idol",
            },
        },
    ],
}

export const WORLD_AREAS = WORLD_DATA.areas
export const WORLD_AREA_BY_ID = Object.fromEntries(
    WORLD_AREAS.map(area => [area.id, area])
)
export const WORLD_ITEM_DEFINITIONS = WORLD_DATA.items
