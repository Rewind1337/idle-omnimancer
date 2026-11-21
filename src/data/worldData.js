// Shared location data for systems that use the world map.
// Keep area identity and axial positions here; item metadata lives in itemData.

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
            unlockedByDefault: true,
            element: null,
            tier: 1,
            areaNumber: 1,
            position: { q: 0, r: 0 },
            exploration: {
                produces: ["item:crossroads_field_notes"],
            },
            combat: {
                produces: ["item:crossroads_waystone"],
            },
        },
        {
            id: "area:mossbound_foothills",
            actionId: "action:explore_mossbound_foothills",
            name: "The Mossbound Foothills",
            element: "earth",
            tier: 1,
            areaNumber: 2,
            position: { q: -1, r: 0 },
            exploration: {
                produces: [
                    "item:mossbound_ore"
                ],
            },
            combat: {
                produces: ["item:mossbound_heartstone"],
            },
        },
        {
            id: "area:whispering_fields",
            actionId: "action:explore_whispering_fields",
            name: "The Whispering Fields",
            element: "air",
            tier: 1,
            areaNumber: 3,
            position: { q: 1, r: -1 },
            exploration: {
                produces: [
                    "item:whispering_seeds",
                ],
            },
            combat: {
                produces: ["item:whispering_chime"],
            },
        },
        {
            id: "area:stillwater_pools",
            actionId: "action:explore_stillwater_pools",
            name: "The Stillwater Pools",
            element: "water",
            tier: 1,
            areaNumber: 4,
            position: { q: 0, r: 1 },
            exploration: {
                produces: [
                    "item:stillwater_reeds",
                ],
            },
            combat: {
                produces: ["item:stillwater_idol"],
            },
        },
        {
            id: "area:earth_tier_2",
            actionId: "action:explore_earth_tier_2",
            name: "earth_tier_2",
            element: "earth",
            tier: 2,
            areaNumber: 5,
            position: { q: -2, r: 1 },
            exploration: {
                produces: [
                    "item:<some new item here>",
                    "item:earth_geode_i"
                ],
            },
            combat: {
                produces: ["item:<some new item here>"],
            },
        },
        {
            id: "area:earth_tier_3",
            actionId: "action:explore_earth_tier_3",
            name: "earth_tier_3",
            element: "earth",
            tier: 3,
            areaNumber: 8,
            position: { q: -2, r: 0 },
            exploration: {
                produces: [
                    "item:<some new item here>",
                ],
            },
            combat: {
                produces: ["item:<some new item here>"],
            },
        },
        {
            id: "area:earth_tier_4",
            actionId: "action:explore_earth_tier_4",
            name: "earth_tier_4",
            element: "earth",
            tier: 4,
            areaNumber: 11,
            position: { q: -1, r: -1 },
            exploration: {
                produces: [
                    "item:<some new item here>",
                    "item:earth_geode_ii"
                ],
            },
            combat: {
                produces: ["item:<some new item here>"],
            },
        },
        {
            id: "area:air_tier_2",
            actionId: "action:explore_air_tier_2",
            name: "air_tier_2",
            element: "air",
            tier: 2,
            areaNumber: 6,
            position: { q: 1, r: -2 },
            exploration: {
                produces: [
                    "item:<some new item here>",
                    "item:air_egg_i",
                ],
            },
            combat: {
                produces: ["item:<some new item here>"],
            },
        },
        {
            id: "area:air_tier_3",
            actionId: "action:explore_air_tier_3",
            name: "air_tier_3",
            element: "air",
            tier: 3,
            areaNumber: 9,
            position: { q: 2, r: -2 },
            exploration: {
                produces: [
                    "item:<some new item here>",
                ],
            },
            combat: {
                produces: ["item:<some new item here>"],
            },
        },
        {
            id: "area:air_tier_4",
            actionId: "action:explore_air_tier_4",
            name: "air_tier_4",
            element: "air",
            tier: 4,
            areaNumber: 12,
            position: { q: 2, r: -1 },
            exploration: {
                produces: [
                    "item:<some new item here>",
                    "item:air_egg_ii",
                ],
            },
            combat: {
                produces: ["item:<some new item here>"],
            },
        },
        {
            id: "area:water_tier_2",
            actionId: "action:explore_water_tier_2",
            name: "water_tier_2",
            element: "water",
            tier: 2,
            areaNumber: 7,
            position: { q: 1, r: 1 },
            exploration: {
                produces: [
                    "item:<some new item here>",
                    "item:water_shell_i",
                ],
            },
            combat: {
                produces: ["item:<some new item here>"],
            },
        },
        {
            id: "area:water_tier_3",
            actionId: "action:explore_water_tier_3",
            name: "water_tier_3",
            element: "water",
            tier: 3,
            areaNumber: 10,
            position: { q: 0, r: 2 },
            exploration: {
                produces: [
                    "item:<some new item here>",
                ],
            },
            combat: {
                produces: ["item:<some new item here>"],
            },
        },
        {
            id: "area:water_tier_4",
            actionId: "action:explore_water_tier_4",
            name: "water_tier_4",
            element: "water",
            tier: 4,
            areaNumber: 13,
            position: { q: -1, r: 2 },
            exploration: {
                produces: [
                    "item:<some new item here>",
                ],
            },
            combat: {
                produces: ["item:<some new item here>"],
            },
        },
    ],
}

export const WORLD_AREAS = WORLD_DATA.areas
export const WORLD_AREA_BY_ID = Object.fromEntries(
    WORLD_AREAS.map(area => [area.id, area])
)
