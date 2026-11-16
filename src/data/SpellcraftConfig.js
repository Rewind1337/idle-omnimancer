export const SPELLCRAFT_CONFIG = {
    id: "skill:spellcraft",

    mana: {
        base: 100,
        regen: 1,
    },

    skillXP: {
        firstLevelXP: 3
    },

    time: {
        base: 2,                 // base action duration in seconds
        perTier: 0.5,              // base action duration increase per action tier within this skill
    },

    actionXP: {
        base: 7,                 // base XP awarded per completed action
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
            id: "action:shape_pebble",
            tier: 1,
            element: "earth",
            manaCost: 2,
            produces: ["item:dust"],
            unlockedByDefault: true,
        },
        {
            id: "action:stir_breeze",
            tier: 1,
            element: "air",
            manaCost: 2,
            produces: ["item:breath"],
        },
        {
            id: "action:gather_droplet",
            tier: 1,
            element: "water",
            manaCost: 2,
            produces: ["item:droplet"],
        },
        {
            id: "action:shape_stone",
            tier: 2,
            element: "earth",
            manaCost: 4,
            produces: ["item:pebble"],
        },
        {
            id: "action:create_gust",
            tier: 2,
            element: "air",
            manaCost: 4,
            produces: ["item:breeze"],
        },
        {
            id: "action:form_ripple",
            tier: 2,
            element: "water",
            manaCost: 4,
            produces: ["item:ripple"],
        },
        {
            id: "action:raise_boulder",
            tier: 3,
            element: "earth",
            manaCost: 7,
            produces: ["item:stone"],
        },
        {
            id: "action:summon_gale",
            tier: 3,
            element: "air",
            manaCost: 7,
            produces: ["item:gust"],
        },
        {
            id: "action:guide_stream",
            tier: 3,
            element: "water",
            manaCost: 7,
            produces: ["item:stream"],
        },
        {
            id: "action:split_the_ground",
            tier: 4,
            element: "earth",
            manaCost: 13,
            produces: ["item:shard"],
        },
        {
            id: "action:call_the_tempest",
            tier: 4,
            element: "air",
            manaCost: 13,
            produces: ["item:gale"],
        },
        {
            id: "action:shape_the_wave",
            tier: 4,
            element: "water",
            manaCost: 13,
            produces: ["item:wave"],
        },
        {
            id: "action:trigger_quake",
            tier: 5,
            element: "earth",
            manaCost: 25,
            produces: ["item:crystal"],
        },
        {
            id: "action:unleash_cyclone",
            tier: 5,
            element: "air",
            manaCost: 25,
            produces: ["item:tempest"],
        },
        {
            id: "action:command_torrent",
            tier: 5,
            element: "water",
            manaCost: 25,
            produces: ["item:torrent"],
        },
        {
            id: "action:mountain_wrath",
            tier: 6,
            element: "earth",
            manaCost: 49,
            produces: ["item:core"],
        },
        {
            id: "action:stormfront",
            tier: 6,
            element: "air",
            manaCost: 49,
            produces: ["item:cyclone"],
        },
        {
            id: "action:tidal_surge",
            tier: 6,
            element: "water",
            manaCost: 49,
            produces: ["item:maelstrom"],
        },
        {
            id: "action:continental_shift",
            tier: 7,
            element: "earth",
            manaCost: 97,
            produces: ["item:mountain_heart"],
        },
        {
            id: "action:sky_rend",
            tier: 7,
            element: "air",
            manaCost: 97,
            produces: ["item:skycore"],
        },
        {
            id: "action:awaken_maelstrom",
            tier: 7,
            element: "water",
            manaCost: 97,
            produces: ["item:abyssal_heart"],
        },
        {
            id: "action:worldshaper",
            tier: 8,
            element: "earth",
            manaCost: 193,
            produces: ["item:worldheart"],
        },
        {
            id: "action:call_of_the_firmament",
            tier: 8,
            element: "air",
            manaCost: 193,
            produces: ["item:firmament_core"],
        },
        {
            id: "action:primordial_tide",
            tier: 8,
            element: "water",
            manaCost: 193,
            produces: ["item:primordial_tide"],
        },
    ],
}