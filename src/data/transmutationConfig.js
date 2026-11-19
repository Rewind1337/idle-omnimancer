// Transmutation connects Research materials with the matching elemental Spellcraft essence.
// Eight tiers mirror the current Spellcraft essence families, giving every essence
// exactly one corresponding Transmutation recipe.
const RESEARCH_MATERIALS = [
    "item:loose_notes",
    "item:bound_notes",
    "item:translated_scrolls",
    "item:arcane_manuscript",
    "item:sealed_grimoire",
    "item:lost_archive_record",
    "item:forgotten_texts",
    "item:forbidden_codex",
]

const ROMAN_TIERS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"]

const ELEMENT_PATHS = [
    {
        element: "earth",
        essences: [
            "item:dust", "item:pebble", "item:stone", "item:shard",
            "item:crystal", "item:core", "item:mountain_heart", "item:worldheart",
        ],
    },
    {
        element: "air",
        essences: [
            "item:breath", "item:breeze", "item:gust", "item:gale",
            "item:tempest", "item:cyclone", "item:skycore", "item:firmament_core",
        ],
    },
    {
        element: "water",
        essences: [
            "item:droplet", "item:ripple", "item:stream", "item:wave",
            "item:torrent", "item:maelstrom", "item:abyssal_heart", "item:primordial_tide",
        ],
    },
]

// Initial recipe quantities and unlock costs are scaffolding for balancing.
const RESEARCH_INPUT_AMOUNTS = [1, 2, 3, 4, 5, 6, 7, 8]
const ESSENCE_INPUT_AMOUNTS = [1, 2, 3, 4, 5, 6, 7, 8]

const getActionUnlockCosts = (tier, elementIndex) => [
    { item: RESEARCH_MATERIALS[tier - 1], amount: tier * 100 },
    { item: "currency:coins", amount: 1000 * Math.pow(10, tier - 1) * (elementIndex + 1) },
]

const ACTIONS = Array.from({ length: ROMAN_TIERS.length }, (_, tierIndex) =>
    ELEMENT_PATHS.map((path, elementIndex) => {
        const tier = tierIndex + 1
        const romanTier = ROMAN_TIERS[tierIndex]
        const catalystId = "item:" + path.element + "_catalyst_" + romanTier.toLowerCase()

        return {
            id: "action:" + path.element + "_transmutation_" + romanTier.toLowerCase(),
            tier,
            element: path.element,
            consumes: [
                { item: RESEARCH_MATERIALS[tierIndex], amount: RESEARCH_INPUT_AMOUNTS[tierIndex] },
                { item: path.essences[tierIndex], amount: ESSENCE_INPUT_AMOUNTS[tierIndex] },
            ],
            produces: [{ item: catalystId, amount: 1 }],
            ...((tier === 1 && elementIndex === 0)
                ? { unlockedByDefault: true }
                : { unlockCosts: getActionUnlockCosts(tier, elementIndex) }),
        }
    })
).flat()

export const TRANSMUTATION_CONFIG = {
    id: "skill:transmutation",

    // The game document calls for Research materials plus elemental essences and gold.
    // These starting requirements should be adjusted once the first economy pass is tested.
    unlockCosts: [
        { item: "item:bound_notes", amount: 100 },
        { item: "currency:coins", amount: 10000 },
    ],

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

    milestones: [],
    actionMilestones: [],
    actions: ACTIONS,
}
