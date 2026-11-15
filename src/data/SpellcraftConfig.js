export const SPELLCRAFT_CONFIG = {
    id: "spellcraft",

    time: {
        base: 2,                 // base action duration in seconds
        perTier: 1,              // base action duration increase per action tier within this skill
    },

    actionXP: {
        base: 6,                 // base XP awarded per completed action
        perTier: 2,              // base XP increment for each action within this skill
    },

    neededXP: {
        base: 12,                // base XP required to reach the next action level
        perTier: 5,              // base += perTier * (tier - 1)
        perLevelMult: 1.122,     // (baseXP * Math.pow(perLevelMult, level - 1)
        perLevelFlat: 1,         // + perLevelFlat * (level - 1))
        perTierMult: 1.0011,     // perLevelMult =* Math.pow(perTierMult, tier - 1)
        finalMultPerLevel: 0.999,// <previous total> * Math.pow(finalMultPerLevel, level - 1)
    },

    actions: [
        // Tier I
        {
            id: "shape_pebble",
            tier: 1,
            element: "earth",
            manaCost: 1,
            outputItem: "dust",
            unlockedByDefault: true,
        },
        {
            id: "stir_breeze",
            tier: 1,
            element: "air",
            manaCost: 1,
            outputItem: "breath",
        },
        {
            id: "gather_droplet",
            tier: 1,
            element: "water",
            manaCost: 1,
            outputItem: "droplet",
        },
        {
            id: "shape_stone",
            tier: 2,
            element: "earth",
            manaCost: 1,
            outputItem: "pebble",
        },
        {
            id: "create_gust",
            tier: 2,
            element: "air",
            manaCost: 1,
            outputItem: "breeze",
        },
        {
            id: "form_ripple",
            tier: 2,
            element: "water",
            manaCost: 1,
            outputItem: "ripple",
        },
        {
            id: "raise_boulder",
            tier: 3,
            element: "earth",
            manaCost: 1,
            outputItem: "stone",
        },
        {
            id: "summon_gale",
            tier: 3,
            element: "air",
            manaCost: 1,
            outputItem: "gust",
        },
        {
            id: "guide_stream",
            tier: 3,
            element: "water",
            manaCost: 1,
            outputItem: "stream",
        },
        {
            id: "split_the_ground",
            tier: 4,
            element: "earth",
            manaCost: 1,
            outputItem: "shard",
        },
        {
            id: "call_the_tempest",
            tier: 4,
            element: "air",
            manaCost: 1,
            outputItem: "gale",
        },
        {
            id: "shape_the_wave",
            tier: 4,
            element: "water",
            manaCost: 1,
            outputItem: "wave",
        },
        {
            id: "trigger_quake",
            tier: 5,
            element: "earth",
            manaCost: 1,
            outputItem: "crystal",
        },
        {
            id: "unleash_cyclone",
            tier: 5,
            element: "air",
            manaCost: 1,
            outputItem: "tempest",
        },
        {
            id: "command_torrent",
            tier: 5,
            element: "water",
            manaCost: 1,
            outputItem: "torrent",
        },
        {
            id: "mountain_wrath",
            tier: 6,
            element: "earth",
            manaCost: 1,
            outputItem: "core",
        },
        {
            id: "stormfront",
            tier: 6,
            element: "air",
            manaCost: 1,
            outputItem: "cyclone",
        },
        {
            id: "tidal_surge",
            tier: 6,
            element: "water",
            manaCost: 1,
            outputItem: "maelstrom",
        },
        {
            id: "continental_shift",
            tier: 7,
            element: "earth",
            manaCost: 1,
            outputItem: "mountain_heart",
        },
        {
            id: "sky_rend",
            tier: 7,
            element: "air",
            manaCost: 1,
            outputItem: "skycore",
        },
        {
            id: "awaken_maelstrom",
            tier: 7,
            element: "water",
            manaCost: 1,
            outputItem: "abyssal_heart",
        },
        {
            id: "worldshaper",
            tier: 8,
            element: "earth",
            manaCost: 1,
            outputItem: "worldheart",
        },
        {
            id: "call_of_the_firmament",
            tier: 8,
            element: "air",
            manaCost: 1,
            outputItem: "firmament_core",
        },
        {
            id: "primordial_tide",
            tier: 8,
            element: "water",
            manaCost: 1,
            outputItem: "primordial_tide",
        },
    ],
}