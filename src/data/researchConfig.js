export const RESEARCH_CONFIG = {
    id: "skill:research",
    unlockedByDefault: true,

    skillXP: {
        firstLevelXP: 2
    },

    time: {
        base: 2,                 // base action duration in seconds
        perTier: 1,              // base action duration increase per action tier within this skill
    },

    actionXP: {
        base: 6,                 // base XP awarded per completed action
        perTier: 2,              // base XP increment for each action within this skill
    },

    neededXP: {
        base: 10,                // base XP required to reach the next action level
        perTier: 4,              // base += perTier * (tier - 1)
        perLevelMult: 1.12,      // (baseXP * Math.pow(perLevelMult, level - 1)
        perLevelFlat: 0,         // + perLevelFlat * (level - 1))
        perTierMult: 1.001,      // perLevelMult =* Math.pow(perTierMult, tier - 1)
        finalMultPerLevel: 0.999,// <previous total> * Math.pow(finalMultPerLevel, level - 1)
    },

    actions: [
        {
            id: "action:read_books",
            tier: 1,
            produces: ["item:loose_notes"],
            unlockedByDefault: true,
        },
        {
            id: "action:study_ancient_notes",
            tier: 2,
            produces: ["item:bound_notes"],
        },
        {
            id: "action:translate_ancient_scrolls",
            tier: 3,
            produces: ["item:translated_scrolls"],
        },
        {
            id: "action:examine_arcane_manuscripts",
            tier: 4,
            produces: ["item:arcane_manuscript"],
        },
        {
            id: "action:decipher_sealed_tomes",
            tier: 5,
            produces: ["item:sealed_grimoire"],
        },
        {
            id: "action:explore_lost_archives",
            tier: 6,
            produces: ["item:lost_archive_record"],
        },
        {
            id: "action:recover_forgotten_texts",
            tier: 7,
            produces: ["item:forgotten_texts"],
        },
        {
            id: "action:investigate_forbidden_lore",
            tier: 8,
            produces: ["item:forbidden_codex"],
        },
        {
            id: "action:unravel_primordial_mysteries",
            tier: 9,
            produces: ["item:primordial_chronicle"],
        },
        {
            id: "action:research_the_first_truth",
            tier: 10,
            produces: ["item:genesis_testament"],
        },
    ],
}