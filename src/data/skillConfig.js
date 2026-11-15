const GLOBAL_CONFIG = {
    maxSkillLevel: 100,         // max level of any skill
    maxActionLevel: 100,        // max level of any action
}

const RESEARCH_CONFIG = {
    id: "research",
    name: "Research",

    time: {
        base: 2,                // base action duration in seconds
        perTier: 1,             // base action duration increase per action tier within this skill
    },

    actionXP: {
        base: 6,                // base XP awarded per completed action
        perTier: 2,             // base XP increment for each action within this skill
    },

    neededXP: {
        base: 10,               // base XP required to reach the next action level
        perTier: 4,             // base XP increment for each action within this skill
        perLevelFlat: 1,        // base XP flat increment for each level in this action
        perLevelMult: 1.075,    // base XP multiplicative increment for each level in this action
    },

    // Action definitions
    actions: [
        {
            id: "read_books",
            tier: 1,
            name: "Read Books",
            outputItem: "loose_notes",
            unlockedByDefault: true,
        },
        {
            id: "study_ancient_notes",
            tier: 2,
            name: "Study Ancient Notes",
            outputItem: "bound_notes",
        },
        {
            id: "examine_arcane_manuscripts",
            tier: 3,
            name: "Examine Arcane Manuscripts",
            outputItem: "arcane_manuscript",
        },
        {
            id: "decipher_sealed_tomes",
            tier: 4,
            name: "Decipher Sealed Tomes",
            outputItem: "sealed_grimoire",
        },
        {
            id: "explore_lost_archives",
            tier: 5,
            name: "Explore Lost Archives",
            outputItem: "lost_archive_record",
        },
        {
            id: "investigate_forbidden_lore",
            tier: 6,
            name: "Investigate Forbidden Lore",
            outputItem: "forbidden_codex",
        },
        {
            id: "unravel_primordial_mysteries",
            tier: 7,
            name: "Unravel Primordial Mysteries",
            outputItem: "primordial_chronicle",
        },
        {
            id: "research_the_first_truth",
            tier: 8,
            name: "Research the First Truth",
            outputItem: "genesis_testament",
        },
    ],
}