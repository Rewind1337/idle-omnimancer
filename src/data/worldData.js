// Shared location data for systems that use the world map.
// Keep area identity and axial positions here; item metadata lives in itemData.
// Area-level produces are shared by Exploration and Combat; nested drops are activity-specific.

const AREA_UNLOCK_COSTS = {
    1: [{ item: "currency:coins", amount: 10000 }],
    2: [{ item: "currency:coins", amount: 30000 }],
    3: [{ item: "currency:coins", amount: 75000 }],
    4: [{ item: "currency:coins", amount: 150000 }],
    5: [{ item: "currency:coins", amount: 300000 }],
    6: [{ item: "currency:coins", amount: 500000 }],
    7: [{ item: "currency:coins", amount: 750000 }],
    8: [{ item: "currency:coins", amount: 1000000 }],
    9: [{ item: "currency:coins", amount: 1500000 }],
    10: [{ item: "currency:coins", amount: 2000000 }],
    11: [{ item: "currency:coins", amount: 3000000 }],
    12: [{ item: "currency:coins", amount: 4000000 }],
    13: [{ item: "currency:coins", amount: 5000000 }],
}

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
            produces: ["item:crossroads_field_notes"],

            exploration: {

                produces: ["item:neutral_prism_i"] },
            combat: { enemyLineup: [{ archetype: "average" }], produces: ["item:unidentified_crossroads_artifact"], artifactId: "item:crossroads_waystone" },
        },
        {
            id: "area:mossbound_foothills",
            actionId: "action:explore_mossbound_foothills",
            name: "The Mossbound Foothills",
            element: "earth",
            tier: 1,
            areaNumber: 2,
            position: { q: -1, r: 0 },
            produces: ["item:mossbound_ore"],

            exploration: {

                produces: [],
                unlockCosts: AREA_UNLOCK_COSTS[1],
            },
            combat: { enemyLineup: [{ archetype: "quick" }], produces: ["item:unidentified_mossbound_foothills_artifact"], artifactId: "item:mossbound_heartstone" },
        },
        {
            id: "area:whispering_fields",
            actionId: "action:explore_whispering_fields",
            name: "The Whispering Fields",
            element: "air",
            tier: 1,
            areaNumber: 3,
            position: { q: 1, r: -1 },
            produces: ["item:whispering_seeds"],

            exploration: {

                produces: [],
                unlockCosts: AREA_UNLOCK_COSTS[1],
            },
            combat: { enemyLineup: [{ archetype: "strong" }], produces: ["item:unidentified_whispering_fields_artifact"], artifactId: "item:whispering_chime" },
        },
        {
            id: "area:stillwater_pools",
            actionId: "action:explore_stillwater_pools",
            name: "The Stillwater Pools",
            element: "water",
            tier: 1,
            areaNumber: 4,
            position: { q: 0, r: 1 },
            produces: ["item:stillwater_reeds"],

            exploration: {

                produces: [],
                unlockCosts: AREA_UNLOCK_COSTS[1],
            },
            combat: { enemyLineup: [{ archetype: "tank" }], produces: ["item:unidentified_stillwater_pools_artifact"], artifactId: "item:stillwater_idol" },
        },
        {
            id: "area:ironroot_ravine",
            actionId: "action:explore_ironroot_ravine",
            name: "The Ironroot Ravine",
            element: "earth",
            tier: 2,
            areaNumber: 5,
            position: { q: -2, r: 1 },
            produces: ["item:ironroot_ore"],

            exploration: {

                produces: ["item:earth_geode_i"],
                unlockCosts: AREA_UNLOCK_COSTS[2],
            },
            combat: { enemyLineup: [{ archetype: "average" }], produces: ["item:unidentified_ironroot_ravine_artifact"], artifactId: "item:ironroot_golem_core" },
        },
        {
            id: "area:zephyr_heights",
            actionId: "action:explore_zephyr_heights",
            name: "The Zephyr Heights",
            element: "air",
            tier: 2,
            areaNumber: 6,
            position: { q: 1, r: -2 },
            produces: ["item:zephyr_plumes"],

            exploration: {

                produces: ["item:air_egg_i"],
                unlockCosts: AREA_UNLOCK_COSTS[2],
            },
            combat: { enemyLineup: [{ archetype: "quick" }], produces: ["item:unidentified_zephyr_heights_artifact"], artifactId: "item:zephyr_wisp_chime" },
        },
        {
            id: "area:moonlit_fen",
            actionId: "action:explore_moonlit_fen",
            name: "The Moonlit Fen",
            element: "water",
            tier: 2,
            areaNumber: 7,
            position: { q: 1, r: 1 },
            produces: ["item:moonlit_pearls"],

            exploration: {

                produces: ["item:water_shell_i"],
                unlockCosts: AREA_UNLOCK_COSTS[2],
            },
            combat: { enemyLineup: [{ archetype: "strong" }], produces: ["item:unidentified_moonlit_fen_artifact"], artifactId: "item:fenwarden_idol" },
        },
        {
            id: "area:shattered_crags",
            actionId: "action:explore_shattered_crags",
            name: "The Shattered Crags",
            element: "earth",
            tier: 3,
            areaNumber: 8,
            position: { q: -2, r: 0 },
            produces: ["item:shatterstone_fragments"],

            exploration: {

                produces: [],
                unlockCosts: AREA_UNLOCK_COSTS[3],
            },
            combat: { enemyLineup: [{ archetype: "tank" }], produces: ["item:unidentified_shattered_crags_artifact"], artifactId: "item:cragbound_relic" },
        },
        {
            id: "area:tempest_reach",
            actionId: "action:explore_tempest_reach",
            name: "The Tempest Reach",
            element: "air",
            tier: 3,
            areaNumber: 9,
            position: { q: 2, r: -2 },
            produces: ["item:stormglass_shards"],

            exploration: {

                produces: [],
                unlockCosts: AREA_UNLOCK_COSTS[3],
            },
            combat: { enemyLineup: [{ archetype: "average" }], produces: ["item:unidentified_tempest_reach_artifact"], artifactId: "item:tempest_eye" },
        },
        {
            id: "area:drowned_sanctum",
            actionId: "action:explore_drowned_sanctum",
            name: "The Drowned Sanctum",
            element: "water",
            tier: 3,
            areaNumber: 10,
            position: { q: 0, r: 2 },
            produces: ["item:abyssal_ink"],

            exploration: {

                produces: [],
                unlockCosts: AREA_UNLOCK_COSTS[3],
            },
            combat: { enemyLineup: [{ archetype: "quick" }], produces: ["item:unidentified_drowned_sanctum_artifact"], artifactId: "item:drowned_scepter" },
        },
        {
            id: "area:basalt_crown",
            actionId: "action:explore_basalt_crown",
            name: "The Basalt Crown",
            element: "earth",
            tier: 4,
            areaNumber: 11,
            position: { q: -1, r: -1 },
            produces: ["item:basalt_heart"],

            exploration: {

                produces: ["item:earth_geode_ii"],
                unlockCosts: AREA_UNLOCK_COSTS[4],
            },
            combat: { enemyLineup: [{ archetype: "strong" }], produces: ["item:unidentified_basalt_crown_artifact"], artifactId: "item:basalt_crown_fragment" },
        },
        {
            id: "area:skybreak_summit",
            actionId: "action:explore_skybreak_summit",
            name: "The Skybreak Summit",
            element: "air",
            tier: 4,
            areaNumber: 12,
            position: { q: 2, r: -1 },
            produces: ["item:skybreak_aether"],

            exploration: {

                produces: ["item:air_egg_ii"],
                unlockCosts: AREA_UNLOCK_COSTS[4],
            },
            combat: { enemyLineup: [{ archetype: "tank" }], produces: ["item:unidentified_skybreak_summit_artifact"], artifactId: "item:skybreak_sigil" },
        },
        {
            id: "area:tidal_abyss",
            actionId: "action:explore_tidal_abyss",
            name: "The Tidal Abyss",
            element: "water",
            tier: 4,
            areaNumber: 13,
            position: { q: -1, r: 2 },
            produces: ["item:tidal_heart"],

            exploration: {

                produces: ["item:water_shell_ii"],
                unlockCosts: AREA_UNLOCK_COSTS[4],
            },
            combat: { enemyLineup: [{ archetype: "average" }], produces: ["item:unidentified_tidal_abyss_artifact"], artifactId: "item:abyssal_crown" },
        },
        {
            id: "area:deepstone_warrens",
            actionId: "action:explore_deepstone_warrens",
            name: "The Deepstone Warrens",
            element: "earth",
            tier: 5,
            areaNumber: 14,
            position: { q: -3, r: 2 },
            produces: ["item:deepstone_crystals"],

            exploration: {

                produces: [],
                unlockCosts: AREA_UNLOCK_COSTS[5],
            },
            combat: { enemyLineup: [{ archetype: "quick" }], produces: ["item:unidentified_deepstone_warrens_artifact"], artifactId: "item:deepstone_guardian_core" },
        },
        {
            id: "area:highwind_expanse",
            actionId: "action:explore_highwind_expanse",
            name: "The Highwind Expanse",
            element: "air",
            tier: 5,
            areaNumber: 15,
            position: { q: 1, r: -3 },
            produces: ["item:highwind_plumes"],

            exploration: {

                produces: [],
                unlockCosts: AREA_UNLOCK_COSTS[5],
            },
            combat: { enemyLineup: [{ archetype: "strong" }], produces: ["item:unidentified_highwind_expanse_artifact"], artifactId: "item:highwind_wisp_chime" },
        },
        {
            id: "area:mooncurrent_basin",
            actionId: "action:explore_mooncurrent_basin",
            name: "The Mooncurrent Basin",
            element: "water",
            tier: 5,
            areaNumber: 16,
            position: { q: 2, r: 1 },
            produces: ["item:mooncurrent_pearls"],

            exploration: {

                produces: [],
                unlockCosts: AREA_UNLOCK_COSTS[5],
            },
            combat: { enemyLineup: [{ archetype: "tank" }], produces: ["item:unidentified_mooncurrent_basin_artifact"], artifactId: "item:mooncurrent_tide_idol" },
        },
        {
            id: "area:verdant_crucible",
            actionId: "action:explore_verdant_crucible",
            name: "The Verdant Crucible",
            element: "earth",
            tier: 6,
            areaNumber: 17,
            position: { q: -3, r: 0 },
            produces: ["item:verdant_heartwood"],

            exploration: {

                produces: ["item:earth_geode_iii"],
                unlockCosts: AREA_UNLOCK_COSTS[6],
            },
            combat: { enemyLineup: [{ archetype: "average" }], produces: ["item:unidentified_verdant_crucible_artifact"], artifactId: "item:verdant_golem_core" },
        },
        {
            id: "area:stormwing_pinnacles",
            actionId: "action:explore_stormwing_pinnacles",
            name: "The Stormwing Pinnacles",
            element: "air",
            tier: 6,
            areaNumber: 18,
            position: { q: 3, r: -3 },
            produces: ["item:stormwing_feathers"],

            exploration: {

                produces: ["item:air_egg_iii"],
                unlockCosts: AREA_UNLOCK_COSTS[6],
            },
            combat: { enemyLineup: [{ archetype: "quick" }], produces: ["item:unidentified_stormwing_pinnacles_artifact"], artifactId: "item:stormwing_wisp_chime" },
        },
        {
            id: "area:glacial_mirror",
            actionId: "action:explore_glacial_mirror",
            name: "The Glacial Mirror",
            element: "water",
            tier: 6,
            areaNumber: 19,
            position: { q: 0, r: 3 },
            produces: ["item:glacial_pearls"],

            exploration: {

                produces: ["item:water_shell_iii"],
                unlockCosts: AREA_UNLOCK_COSTS[6],
            },
            combat: { enemyLineup: [{ archetype: "strong" }], produces: ["item:unidentified_glacial_mirror_artifact"], artifactId: "item:glacial_tide_idol" },
        },
        {
            id: "area:obsidian_throne",
            actionId: "action:explore_obsidian_throne",
            name: "The Obsidian Throne",
            element: "earth",
            tier: 7,
            areaNumber: 20,
            position: { q: -1, r: -2 },
            produces: ["item:obsidian_fragments"],

            exploration: {

                produces: [],
                unlockCosts: AREA_UNLOCK_COSTS[7],
            },
            combat: { enemyLineup: [{ archetype: "tank" }], produces: ["item:unidentified_obsidian_throne_artifact"], artifactId: "item:obsidian_golem_relic" },
        },
        {
            id: "area:celestial_rift",
            actionId: "action:explore_celestial_rift",
            name: "The Celestial Rift",
            element: "air",
            tier: 7,
            areaNumber: 21,
            position: { q: 3, r: -1 },
            produces: ["item:celestial_aether"],

            exploration: {

                produces: [],
                unlockCosts: AREA_UNLOCK_COSTS[7],
            },
            combat: { enemyLineup: [{ archetype: "average" }], produces: ["item:unidentified_celestial_rift_artifact"], artifactId: "item:celestial_wisp_chime" },
        },
        {
            id: "area:leviathan_trench",
            actionId: "action:explore_leviathan_trench",
            name: "The Leviathan Trench",
            element: "water",
            tier: 7,
            areaNumber: 22,
            position: { q: -2, r: 3 },
            produces: ["item:abyssal_corals"],

            exploration: {

                produces: [],
                unlockCosts: AREA_UNLOCK_COSTS[7],
            },
            combat: { enemyLineup: [{ archetype: "quick" }], produces: ["item:unidentified_leviathan_trench_artifact"], artifactId: "item:abyssal_tide_scepter" },
        },
        {
            id: "area:primordial_forge",
            actionId: "action:explore_primordial_forge",
            name: "The Primordial Forge",
            element: "earth",
            tier: 8,
            areaNumber: 23,
            position: { q: -4, r: 3 },
            produces: ["item:primordial_ore"],

            exploration: {

                produces: ["item:earth_geode_iv"],
                unlockCosts: AREA_UNLOCK_COSTS[8],
            },
            combat: { enemyLineup: [{ archetype: "strong" }], produces: ["item:unidentified_primordial_forge_artifact"], artifactId: "item:primordial_golem_heart" },
        },
        {
            id: "area:starfall_firmament",
            actionId: "action:explore_starfall_firmament",
            name: "The Starfall Firmament",
            element: "air",
            tier: 8,
            areaNumber: 24,
            position: { q: 1, r: -4 },
            produces: ["item:starfall_aether"],

            exploration: {

                produces: ["item:air_egg_iv"],
                unlockCosts: AREA_UNLOCK_COSTS[8],
            },
            combat: { enemyLineup: [{ archetype: "tank" }], produces: ["item:unidentified_starfall_firmament_artifact"], artifactId: "item:starfall_wisp_sigil" },
        },
        {
            id: "area:worldtide_sanctum",
            actionId: "action:explore_worldtide_sanctum",
            name: "The Worldtide Sanctum",
            element: "water",
            tier: 8,
            areaNumber: 25,
            position: { q: 3, r: 1 },
            produces: ["item:worldtide_pearls"],

            exploration: {

                produces: ["item:water_shell_iv"],
                unlockCosts: AREA_UNLOCK_COSTS[8],
            },
            combat: { enemyLineup: [{ archetype: "average" }], produces: ["item:unidentified_worldtide_sanctum_artifact"], artifactId: "item:worldtide_tide_crown" },
        },
        {
            id: "area:worldcore_caldera",
            actionId: "action:explore_worldcore_caldera",
            name: "The Worldcore Caldera",
            element: "earth",
            tier: 9,
            areaNumber: 26,
            position: { q: -4, r: 0 },
            produces: ["item:worldcore_shards"],

            exploration: {

                produces: [],
                unlockCosts: AREA_UNLOCK_COSTS[9],
            },
            combat: { enemyLineup: [{ archetype: "quick" }], produces: ["item:unidentified_worldcore_caldera_artifact"], artifactId: "item:worldcore_relic" },
        },
        {
            id: "area:boundless_empyrean",
            actionId: "action:explore_boundless_empyrean",
            name: "The Boundless Empyrean",
            element: "air",
            tier: 9,
            areaNumber: 27,
            position: { q: 4, r: -4 },
            produces: ["item:firmament_plumes"],

            exploration: {

                produces: [],
                unlockCosts: AREA_UNLOCK_COSTS[9],
            },
            combat: { enemyLineup: [{ archetype: "strong" }], produces: ["item:unidentified_boundless_empyrean_artifact"], artifactId: "item:firmament_wisp_chime" },
        },
        {
            id: "area:leviathans_grave",
            actionId: "action:explore_leviathans_grave",
            name: "The Leviathan's Grave",
            element: "water",
            tier: 9,
            areaNumber: 28,
            position: { q: 0, r: 4 },
            produces: ["item:leviathan_essence"],

            exploration: {

                produces: [],
                unlockCosts: AREA_UNLOCK_COSTS[9],
            },
            combat: { enemyLineup: [{ archetype: "tank" }], produces: ["item:unidentified_leviathans_grave_artifact"], artifactId: "item:leviathan_tide_scepter" },
        },
        {
            id: "area:genesis_bastion",
            actionId: "action:explore_genesis_bastion",
            name: "The Genesis Bastion",
            element: "earth",
            tier: 10,
            areaNumber: 29,
            position: { q: -1, r: -3 },
            produces: ["item:genesis_ore"],

            exploration: {

                produces: ["item:earth_geode_v"],
                unlockCosts: AREA_UNLOCK_COSTS[10],
            },
            combat: { enemyLineup: [{ archetype: "average" }], produces: ["item:unidentified_genesis_bastion_artifact"], artifactId: "item:genesis_golem_core" },
        },
        {
            id: "area:origin_zenith",
            actionId: "action:explore_origin_zenith",
            name: "The Origin Zenith",
            element: "air",
            tier: 10,
            areaNumber: 30,
            position: { q: 4, r: -1 },
            produces: ["item:origin_aether"],

            exploration: {

                produces: ["item:air_egg_v"],
                unlockCosts: AREA_UNLOCK_COSTS[10],
            },
            combat: { enemyLineup: [{ archetype: "quick" }], produces: ["item:unidentified_origin_zenith_artifact"], artifactId: "item:origin_wisp_sigil" },
        },
        {
            id: "area:eternal_deep",
            actionId: "action:explore_eternal_deep",
            name: "The Eternal Deep",
            element: "water",
            tier: 10,
            areaNumber: 31,
            position: { q: -3, r: 4 },
            produces: ["item:eternal_tideheart"],

            exploration: {

                produces: ["item:water_shell_v"],
                unlockCosts: AREA_UNLOCK_COSTS[10],
            },
            combat: { enemyLineup: [{ archetype: "strong" }], produces: ["item:unidentified_eternal_deep_artifact"], artifactId: "item:eternal_tide_crown" },
        },
    ],
}

export const WORLD_AREAS = WORLD_DATA.areas
export const WORLD_AREA_BY_ID = Object.fromEntries(
    WORLD_AREAS.map(area => [area.id, area])
)
