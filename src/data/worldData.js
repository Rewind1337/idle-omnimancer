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
            description: "A quiet neutral meeting point where the first paths through the world converge.",
            element: null,
            tier: 1,
            areaNumber: 1,
            position: { q: 0, r: 0 },
            unlockedByDefault: true,
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
            description: "Rolling green slopes hide old stone, rich seams and traces of deep-rooted magic.",
            element: "earth",
            tier: 1,
            areaNumber: 2,
            position: { q: -1, r: 0 },
            unlockedByDefault: true,
            exploration: {
                produces: [
                    "item:mossbound_ore",
                    "item:earth_geode_i"
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
            description: "Open grasslands carry strange winds and scatter seeds touched by the air.",
            element: "air",
            tier: 1,
            areaNumber: 3,
            position: { q: 1, r: -1 },
            unlockedByDefault: true,
            exploration: {
                produces: [
                    "item:whispering_seeds",
                    "item:air_egg_i",
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
            description: "Sheltered pools gather clear water, soft reeds and quiet traces of elemental life.",
            element: "water",
            tier: 1,
            areaNumber: 4,
            position: { q: 0, r: 1 },
            unlockedByDefault: true,
            exploration: {
                produces: [
                    "item:stillwater_reeds",
                    "item:water_shell_i",
                ],
            },
            combat: {
                produces: ["item:stillwater_idol"],
            },
        },
    ],
}

export const WORLD_AREAS = WORLD_DATA.areas
export const WORLD_AREA_BY_ID = Object.fromEntries(
    WORLD_AREAS.map(area => [area.id, area])
)
