export const SPELLCRAFT_CONFIG = {
    id: "skill:spellcraft",
    unlockCosts: [{ amount: 1e2, item: "item:loose_notes" }, { amount: 1e3, item: "currency:coins" }],

    mana: {
        base: 100,
        regen: 1,
        cost: {
            base: 3,
            tierMultiplier: 2,
            tierFlat: -1,
        },
    },

    // Small element-specific trade-offs. Earth is slower but grants more XP,
    // Air is faster but grants less XP, and Water is the balanced baseline.
    elementModifiers: {
        earth: { timeMultiplier: 1.05, xpMultiplier: 1.15 },
        air: { timeMultiplier: 0.95, xpMultiplier: 0.90 },
        water: { timeMultiplier: 1, xpMultiplier: 1 },
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
            produces: ["item:dust"],
            unlockedByDefault: true,
        },
        {
            id: "action:stir_breeze",
            tier: 1,
            element: "air",
            produces: ["item:breath"],
            unlockCosts: [{ amount: 1e2, item: "item:loose_notes" }, { amount: 2e3, item: "currency:coins" }]
        },
        {
            id: "action:gather_droplet",
            tier: 1,
            element: "water",
            produces: ["item:droplet"],
            unlockCosts: [{ amount: 1e2, item: "item:loose_notes" }, { amount: 3e3, item: "currency:coins" }]
        },
        {
            id: "action:shape_stone",
            tier: 2,
            element: "earth",
            produces: ["item:pebble"],
            unlockCosts: [{ amount: 2e2, item: "item:bound_notes" }, { amount: 1e4, item: "currency:coins" }]
        },
        {
            id: "action:create_gust",
            tier: 2,
            element: "air",
            produces: ["item:breeze"],
            unlockCosts: [{ amount: 2e2, item: "item:bound_notes" }, { amount: 2e4, item: "currency:coins" }]
        },
        {
            id: "action:form_ripple",
            tier: 2,
            element: "water",
            produces: ["item:ripple"],
            unlockCosts: [{ amount: 2e2, item: "item:bound_notes" }, { amount: 3e4, item: "currency:coins" }]
        },
        {
            id: "action:raise_boulder",
            tier: 3,
            element: "earth",
            produces: ["item:stone"],
            unlockCosts: [{ amount: 300, item: "item:translated_scrolls" }, { amount: 1e5, item: "currency:coins" }],
        },
        {
            id: "action:summon_gale",
            tier: 3,
            element: "air",
            produces: ["item:gust"],
            unlockCosts: [{ amount: 300, item: "item:translated_scrolls" }, { amount: 2e5, item: "currency:coins" }],
        },
        {
            id: "action:guide_stream",
            tier: 3,
            element: "water",
            produces: ["item:stream"],
            unlockCosts: [{ amount: 300, item: "item:translated_scrolls" }, { amount: 3e5, item: "currency:coins" }],
        },
        {
            id: "action:split_the_ground",
            tier: 4,
            element: "earth",
            produces: ["item:shard"],
            unlockCosts: [{ amount: 400, item: "item:arcane_manuscript" }, { amount: 1e6, item: "currency:coins" }],
        },
        {
            id: "action:call_the_tempest",
            tier: 4,
            element: "air",
            produces: ["item:gale"],
            unlockCosts: [{ amount: 400, item: "item:arcane_manuscript" }, { amount: 2e6, item: "currency:coins" }],
        },
        {
            id: "action:shape_the_wave",
            tier: 4,
            element: "water",
            produces: ["item:wave"],
            unlockCosts: [{ amount: 400, item: "item:arcane_manuscript" }, { amount: 3e6, item: "currency:coins" }],
        },
        {
            id: "action:trigger_quake",
            tier: 5,
            element: "earth",
            produces: ["item:crystal"],
            unlockCosts: [{ amount: 500, item: "item:sealed_grimoire" }, { amount: 1e7, item: "currency:coins" }],
        },
        {
            id: "action:unleash_cyclone",
            tier: 5,
            element: "air",
            produces: ["item:tempest"],
            unlockCosts: [{ amount: 500, item: "item:sealed_grimoire" }, { amount: 2e7, item: "currency:coins" }],
        },
        {
            id: "action:command_torrent",
            tier: 5,
            element: "water",
            produces: ["item:torrent"],
            unlockCosts: [{ amount: 500, item: "item:sealed_grimoire" }, { amount: 3e7, item: "currency:coins" }],
        },
        {
            id: "action:mountain_wrath",
            tier: 6,
            element: "earth",
            produces: ["item:core"],
            unlockCosts: [{ amount: 600, item: "item:lost_archive_record" }, { amount: 1e8, item: "currency:coins" }],
        },
        {
            id: "action:stormfront",
            tier: 6,
            element: "air",
            produces: ["item:cyclone"],
            unlockCosts: [{ amount: 600, item: "item:lost_archive_record" }, { amount: 2e8, item: "currency:coins" }],
        },
        {
            id: "action:tidal_surge",
            tier: 6,
            element: "water",
            produces: ["item:maelstrom"],
            unlockCosts: [{ amount: 600, item: "item:lost_archive_record" }, { amount: 3e8, item: "currency:coins" }],
        },
        {
            id: "action:continental_shift",
            tier: 7,
            element: "earth",
            produces: ["item:mountain_heart"],
            unlockCosts: [{ amount: 700, item: "item:forgotten_texts" }, { amount: 1e9, item: "currency:coins" }],
        },
        {
            id: "action:sky_rend",
            tier: 7,
            element: "air",
            produces: ["item:skycore"],
            unlockCosts: [{ amount: 700, item: "item:forgotten_texts" }, { amount: 2e9, item: "currency:coins" }],
        },
        {
            id: "action:awaken_maelstrom",
            tier: 7,
            element: "water",
            produces: ["item:abyssal_heart"],
            unlockCosts: [{ amount: 700, item: "item:forgotten_texts" }, { amount: 3e9, item: "currency:coins" }],
        },
        {
            id: "action:worldshaper",
            tier: 8,
            element: "earth",
            produces: ["item:worldheart"],
            unlockCosts: [{ amount: 800, item: "item:forbidden_codex" }, { amount: 1e10, item: "currency:coins" }],
        },
        {
            id: "action:call_of_the_firmament",
            tier: 8,
            element: "air",
            produces: ["item:firmament_core"],
            unlockCosts: [{ amount: 800, item: "item:forbidden_codex" }, { amount: 2e10, item: "currency:coins" }],
        },
        {
            id: "action:primordial_tide",
            tier: 8,
            element: "water",
            produces: ["item:primordial_tide"],
            unlockCosts: [{ amount: 800, item: "item:forbidden_codex" }, { amount: 3e10, item: "currency:coins" }],
        },
    ],
}