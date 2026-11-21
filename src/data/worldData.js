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
        // Exploration resources
        { id: "item:crossroads_field_notes", name: "Field Notes", tier: 1, variant: "exploration", type: "resource" },
        { id: "item:mossbound_ore", name: "Mossbound Ore", tier: 1, variant: "earth", type: "resource" },
        { id: "item:whispering_seeds", name: "Whispering Seeds", tier: 1, variant: "air", type: "resource" },
        { id: "item:stillwater_reeds", name: "Stillwater Reeds", tier: 1, variant: "water", type: "resource" },

        // Area artifacts are intended to be obtained through Combat.
        { id: "item:crossroads_waystone", name: "Crossroads Waystone", tier: 1, variant: "exploration", type: "artifact" },
        { id: "item:mossbound_heartstone", name: "Mossbound Heartstone", tier: 1, variant: "earth", type: "artifact" },
        { id: "item:whispering_chime", name: "Whispering Chime", tier: 1, variant: "air", type: "artifact" },
        { id: "item:stillwater_idol", name: "Stillwater Idol", tier: 1, variant: "water", type: "artifact" },

        // Companion containers are found through Exploration and opened through Unveiling.
        { id: "item:earth_geode", name: "Earth Geode", tier: 1, variant: "earth", type: "companionContainer" },
        { id: "item:air_egg", name: "Air Egg", tier: 1, variant: "air", type: "companionContainer" },
        { id: "item:water_shell", name: "Water Shell", tier: 1, variant: "water", type: "companionContainer" },
    ],

    areas: [
        {
            id: "area:the_crossroads",
            actionId: "action:explore_the_crossroads",
            name: "The Crossroads",
            description: "A quiet neutral meeting point where the first paths through the world converge.",
            element: null,
            tier: 1,
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
            position: { q: -1, r: 0 },
            connections: ["area:the_crossroads"],
            unlockedByDefault: true,
            exploration: {
                resourceRewards: [{ item: "item:mossbound_ore", amount: 1 }],
                companionContainer: {
                    item: "item:earth_geode",
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
            position: { q: 1, r: -1 },
            connections: ["area:the_crossroads"],
            unlockedByDefault: true,
            exploration: {
                resourceRewards: [{ item: "item:whispering_seeds", amount: 1 }],
                companionContainer: {
                    item: "item:air_egg",
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
            position: { q: 0, r: 1 },
            connections: ["area:the_crossroads"],
            unlockedByDefault: true,
            exploration: {
                resourceRewards: [{ item: "item:stillwater_reeds", amount: 1 }],
                companionContainer: {
                    item: "item:water_shell",
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
