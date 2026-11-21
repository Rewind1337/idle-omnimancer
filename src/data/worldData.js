// Shared location data for systems that use the world map.
// Keep area identity, positions and connections here; item metadata lives in itemData.

export const WORLD_DATA = {
    id: "world:known_world",
    name: "The Known World",

    map: {
        type: "hex",
        coordinateSystem: "axial",
        startingAreaId: "area:the_crossroads",
    },

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
                produces: [{ item: "item:crossroads_field_notes", amount: 1 }],
            },
            combat: {
                produces: [{ id: "item:crossroads_waystone", amount: 1, baseChance: 0.001 }],
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
                produces: [
                    { item: "item:mossbound_ore", amount: 1 },
                    {
                        id: "item:earth_geode_i",
                        amount: 1,
                        baseChance: 0.001,
                        minimumUnveilingSkillLevel: 1,
                    },
                ],
            },
            combat: {
                produces: [{ id: "item:mossbound_heartstone", amount: 1, baseChance: 0.001 }],
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
                produces: [
                    { item: "item:whispering_seeds", amount: 1 },
                    {
                        id: "item:air_egg_i",
                        amount: 1,
                        baseChance: 0.001,
                        minimumUnveilingSkillLevel: 1,
                    },
                ],
            },
            combat: {
                produces: [{ id: "item:whispering_chime", amount: 1, baseChance: 0.001 }],
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
                produces: [
                    { item: "item:stillwater_reeds", amount: 1 },
                    {
                        id: "item:water_shell_i",
                        amount: 1,
                        baseChance: 0.001,
                        minimumUnveilingSkillLevel: 1,
                    },
                ],
            },
            combat: {
                produces: [{ id: "item:stillwater_idol", amount: 1, baseChance: 0.001 }],
            },
        },
    ],
}

export const WORLD_AREAS = WORLD_DATA.areas
export const WORLD_AREA_BY_ID = Object.fromEntries(
    WORLD_AREAS.map(area => [area.id, area])
)
