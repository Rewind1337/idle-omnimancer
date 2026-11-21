// Transmutation recipes are listed explicitly so each element and tier can be tuned independently.

export const TRANSMUTATION_CONFIG = {
    id: "skill:transmutation",
    unlockCosts: [
        { item: "item:bound_notes", amount: 100 },
        { item: "item:dust", amount: 25 },
        { item: "item:breath", amount: 25 },
        { item: "item:droplet", amount: 25 },
        { item: "currency:coins", amount: 5000 },
    ],
    variant: "transmutation",

    elementModifiers: {
        earth: { timeMultiplier: 1.05, xpMultiplier: 1.15, manaCostMultiplier: 1.1 },
        air: { timeMultiplier: 0.95, xpMultiplier: 0.90, manaCostMultiplier: 0.9 },
        water: { timeMultiplier: 1, xpMultiplier: 1, manaCostMultiplier: 1 },
    },

    skillXP: {
        firstLevelXP: 3,
    },

    // Initial timing and XP values are placeholders for balancing.
    time: {
        base: 3,
        perTier: 1,
    },

    actionXP: {
        base: 9,
        perTier: 6,
    },

    neededXP: {
        base: 18,
        perTier: 8,
        perLevelMult: 1.124,
        perLevelFlat: 2,
        perTierMult: 1.0012,
        finalMultPerLevel: 0.999,
    },

    milestones: [
        { level: 10, reach: "local", type: "mult", effect: "actionTime", value: 1.2 },
        { level: 20, reach: "skill:research", type: "mult", effect: "actionTime", value: 1.2 },
        { level: 30, reach: "global", type: "mult", effect: "preservation", value: 1.05 },
    ],

    actionMilestones: [
        { levels: 2, type: "mult", effect: "itemOutput", value: 1.01 },
        { levels: 5, type: "mult", effect: "preservation", value: 1.01 },
        { levels: 20, type: "mult", effect: "xpGain", value: 1.1 },
    ],

    actions: [
        {
            id: "action:earth_transmutation_i",
            tier: 1,
            element: "earth",
            name: "Lesser Earth Transmutation",
            consumes: [
                { item: "item:dust", amount: 1 },
            ],
            produces: [{ item: "item:earth_catalyst_i", amount: 1 }],
            unlockedByDefault: true,
        },
        {
            id: "action:air_transmutation_i",
            tier: 1,
            element: "air",
            name: "Lesser Air Transmutation",
            consumes: [
                { item: "item:breath", amount: 1 },
            ],
            produces: [{ item: "item:air_catalyst_i", amount: 1 }],
            unlockCosts: [
                { item: "item:loose_notes", amount: 100 },
                { item: "currency:coins", amount: 2000 },
            ],
        },
        {
            id: "action:water_transmutation_i",
            tier: 1,
            element: "water",
            name: "Lesser Water Transmutation",
            consumes: [
                { item: "item:droplet", amount: 1 },
            ],
            produces: [{ item: "item:water_catalyst_i", amount: 1 }],
            unlockCosts: [
                { item: "item:loose_notes", amount: 100 },
                { item: "currency:coins", amount: 3000 },
            ],
        },
        {
            id: "action:earth_transmutation_ii",
            tier: 2,
            element: "earth",
            name: "Weak Earth Transmutation",
            consumes: [
                { item: "item:pebble", amount: 2 },
            ],
            produces: [{ item: "item:earth_catalyst_ii", amount: 1 }],
            unlockCosts: [
                { item: "item:bound_notes", amount: 200 },
                { item: "currency:coins", amount: 10000 },
            ],
        },
        {
            id: "action:air_transmutation_ii",
            tier: 2,
            element: "air",
            name: "Weak Air Transmutation",
            consumes: [
                { item: "item:breeze", amount: 2 },
            ],
            produces: [{ item: "item:air_catalyst_ii", amount: 1 }],
            unlockCosts: [
                { item: "item:bound_notes", amount: 200 },
                { item: "currency:coins", amount: 20000 },
            ],
        },
        {
            id: "action:water_transmutation_ii",
            tier: 2,
            element: "water",
            name: "Weak Water Transmutation",
            consumes: [
                { item: "item:ripple", amount: 2 },
            ],
            produces: [{ item: "item:water_catalyst_ii", amount: 1 }],
            unlockCosts: [
                { item: "item:bound_notes", amount: 200 },
                { item: "currency:coins", amount: 30000 },
            ],
        },
        {
            id: "action:earth_transmutation_iii",
            tier: 3,
            element: "earth",
            name: "Regular Earth Transmutation",
            consumes: [
                { item: "item:stone", amount: 3 },
            ],
            produces: [{ item: "item:earth_catalyst_iii", amount: 1 }],
            unlockCosts: [
                { item: "item:translated_scrolls", amount: 300 },
                { item: "currency:coins", amount: 100000 },
            ],
        },
        {
            id: "action:air_transmutation_iii",
            tier: 3,
            element: "air",
            name: "Regular Air Transmutation",
            consumes: [
                { item: "item:gust", amount: 3 },
            ],
            produces: [{ item: "item:air_catalyst_iii", amount: 1 }],
            unlockCosts: [
                { item: "item:translated_scrolls", amount: 300 },
                { item: "currency:coins", amount: 200000 },
            ],
        },
        {
            id: "action:water_transmutation_iii",
            tier: 3,
            element: "water",
            name: "Regular Water Transmutation",
            consumes: [
                { item: "item:stream", amount: 3 },
            ],
            produces: [{ item: "item:water_catalyst_iii", amount: 1 }],
            unlockCosts: [
                { item: "item:translated_scrolls", amount: 300 },
                { item: "currency:coins", amount: 300000 },
            ],
        },
        {
            id: "action:earth_transmutation_iv",
            tier: 4,
            element: "earth",
            name: "Greater Earth Transmutation",
            consumes: [
                { item: "item:shard", amount: 4 },
            ],
            produces: [{ item: "item:earth_catalyst_iv", amount: 1 }],
            unlockCosts: [
                { item: "item:arcane_manuscript", amount: 400 },
                { item: "currency:coins", amount: 1000000 },
            ],
        },
        {
            id: "action:air_transmutation_iv",
            tier: 4,
            element: "air",
            name: "Greater Air Transmutation",
            consumes: [
                { item: "item:gale", amount: 4 },
            ],
            produces: [{ item: "item:air_catalyst_iv", amount: 1 }],
            unlockCosts: [
                { item: "item:arcane_manuscript", amount: 400 },
                { item: "currency:coins", amount: 2000000 },
            ],
        },
        {
            id: "action:water_transmutation_iv",
            tier: 4,
            element: "water",
            name: "Greater Water Transmutation",
            consumes: [
                { item: "item:wave", amount: 4 },
            ],
            produces: [{ item: "item:water_catalyst_iv", amount: 1 }],
            unlockCosts: [
                { item: "item:arcane_manuscript", amount: 400 },
                { item: "currency:coins", amount: 3000000 },
            ],
        },
        {
            id: "action:earth_transmutation_v",
            tier: 5,
            element: "earth",
            name: "Superior Earth Transmutation",
            consumes: [
                { item: "item:crystal", amount: 5 },
            ],
            produces: [{ item: "item:earth_catalyst_v", amount: 1 }],
            unlockCosts: [
                { item: "item:sealed_grimoire", amount: 500 },
                { item: "currency:coins", amount: 10000000 },
            ],
        },
        {
            id: "action:air_transmutation_v",
            tier: 5,
            element: "air",
            name: "Superior Air Transmutation",
            consumes: [
                { item: "item:tempest", amount: 5 },
            ],
            produces: [{ item: "item:air_catalyst_v", amount: 1 }],
            unlockCosts: [
                { item: "item:sealed_grimoire", amount: 500 },
                { item: "currency:coins", amount: 20000000 },
            ],
        },
        {
            id: "action:water_transmutation_v",
            tier: 5,
            element: "water",
            name: "Superior Water Transmutation",
            consumes: [
                { item: "item:torrent", amount: 5 },
            ],
            produces: [{ item: "item:water_catalyst_v", amount: 1 }],
            unlockCosts: [
                { item: "item:sealed_grimoire", amount: 500 },
                { item: "currency:coins", amount: 30000000 },
            ],
        },
        {
            id: "action:earth_transmutation_vi",
            tier: 6,
            element: "earth",
            name: "Exalted Earth Transmutation",
            consumes: [
                { item: "item:core", amount: 6 },
            ],
            produces: [{ item: "item:earth_catalyst_vi", amount: 1 }],
            unlockCosts: [
                { item: "item:lost_archive_record", amount: 600 },
                { item: "currency:coins", amount: 100000000 },
            ],
        },
        {
            id: "action:air_transmutation_vi",
            tier: 6,
            element: "air",
            name: "Exalted Air Transmutation",
            consumes: [
                { item: "item:cyclone", amount: 6 },
            ],
            produces: [{ item: "item:air_catalyst_vi", amount: 1 }],
            unlockCosts: [
                { item: "item:lost_archive_record", amount: 600 },
                { item: "currency:coins", amount: 200000000 },
            ],
        },
        {
            id: "action:water_transmutation_vi",
            tier: 6,
            element: "water",
            name: "Exalted Water Transmutation",
            consumes: [
                { item: "item:maelstrom", amount: 6 },
            ],
            produces: [{ item: "item:water_catalyst_vi", amount: 1 }],
            unlockCosts: [
                { item: "item:lost_archive_record", amount: 600 },
                { item: "currency:coins", amount: 300000000 },
            ],
        },
        {
            id: "action:earth_transmutation_vii",
            tier: 7,
            element: "earth",
            name: "Supreme Earth Transmutation",
            consumes: [
                { item: "item:mountain_heart", amount: 7 },
            ],
            produces: [{ item: "item:earth_catalyst_vii", amount: 1 }],
            unlockCosts: [
                { item: "item:forgotten_texts", amount: 700 },
                { item: "currency:coins", amount: 1000000000 },
            ],
        },
        {
            id: "action:air_transmutation_vii",
            tier: 7,
            element: "air",
            name: "Supreme Air Transmutation",
            consumes: [
                { item: "item:skycore", amount: 7 },
            ],
            produces: [{ item: "item:air_catalyst_vii", amount: 1 }],
            unlockCosts: [
                { item: "item:forgotten_texts", amount: 700 },
                { item: "currency:coins", amount: 2000000000 },
            ],
        },
        {
            id: "action:water_transmutation_vii",
            tier: 7,
            element: "water",
            name: "Supreme Water Transmutation",
            consumes: [
                { item: "item:abyssal_heart", amount: 7 },
            ],
            produces: [{ item: "item:water_catalyst_vii", amount: 1 }],
            unlockCosts: [
                { item: "item:forgotten_texts", amount: 700 },
                { item: "currency:coins", amount: 3000000000 },
            ],
        },
        {
            id: "action:earth_transmutation_viii",
            tier: 8,
            element: "earth",
            name: "Transcendent Earth Transmutation",
            consumes: [
                { item: "item:worldheart", amount: 8 },
            ],
            produces: [{ item: "item:earth_catalyst_viii", amount: 1 }],
            unlockCosts: [
                { item: "item:forbidden_codex", amount: 800 },
                { item: "currency:coins", amount: 10000000000 },
            ],
        },
        {
            id: "action:air_transmutation_viii",
            tier: 8,
            element: "air",
            name: "Transcendent Air Transmutation",
            consumes: [
                { item: "item:firmament_core", amount: 8 },
            ],
            produces: [{ item: "item:air_catalyst_viii", amount: 1 }],
            unlockCosts: [
                { item: "item:forbidden_codex", amount: 800 },
                { item: "currency:coins", amount: 20000000000 },
            ],
        },
        {
            id: "action:water_transmutation_viii",
            tier: 8,
            element: "water",
            name: "Transcendent Water Transmutation",
            consumes: [
                { item: "item:primordial_tide", amount: 8 },
            ],
            produces: [{ item: "item:water_catalyst_viii", amount: 1 }],
            unlockCosts: [
                { item: "item:forbidden_codex", amount: 800 },
                { item: "currency:coins", amount: 30000000000 },
            ],
        },
    ],
}
