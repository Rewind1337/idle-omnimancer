export const RESEARCH_CONFIG = {
    id: "skill:research",
    unlockedByDefault: true,
    variant: "research",

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

    /*
    milestones
        reach: 'local', 'global' or a specific skill id, like 'skill:spellcraft'
            'local' -> this current skill (research) would be boosted
            'global' -> all skills would be boosted
            'skill:id' -> only that skill will be boosted
        type: 'flat', 'mult'
            'flat' -> bonus gets added on to the other ones
            'mult' -> bonus gets multiplied ontop of the existing ones
        effect: 'xpGain', 'actionTime', 'itemOutput', 'preservation', 'manaCost', 'manaCapacity'
            'xpGain' -> boosts the xp gained FOR actions, not the skill xp
            'actionTime' -> reduces the time required to complete an action
            'itemOutput' -> multiplies the final output by this amount, fractions will be rolled, for example having a x2.38 output mult would result in 2 items, with an 38% chance for a third.
            'preservation' -> chance to not consume the required items when completing this action
            'manaCost' -> reduces the mana costs by this much (only really for spellcraft, at the moment)
            'manaCapacity' -> increases the maximum mana by this much (only really for spellcraft, at the moment)
            'manaRegeneration' -> increases the mana regen by this much (only really for spellcraft, at the moment)
    */
    milestones: [
        { level: 10, reach: "local", type: "mult", effect: "actionTime", value: 1.1 },
        { level: 20, reach: "skill:spellcraft", type: "mult", effect: "actionTime", value: 1.2 },
        { level: 30, reach: "global", type: "mult", effect: "xpGain", value: 1.1 },
        // 40, 50, 60, 70, 80, 90, 100
    ],

    /*
    action milestones
        these are only for the action they are achieved on, for example, tier 1 research would boost itself.
        type: 'flat', 'mult'
            'flat' -> bonus gets added on to the other ones
            'mult' -> bonus gets multiplied ontop of the existing ones
        effect: 'xpGain', 'actionTime', 'itemOutput', 'preservation', 'manaCost', 'manaCapacity'
            'xpGain' -> boosts the xp gained FOR actions, not the skill xp
            'actionTime' -> reduces the time required to complete an action
            'itemOutput' -> multiplies the final output by this amount, fractions will be rolled, for example having a x2.38 output mult would result in 2 items, with an 38% chance for a third.
            'preservation' -> chance to not consume the required items when completing this action
            'manaCost' -> reduces the mana costs by this much (only really for spellcraft, at the moment)
            'manaCapacity' -> increases the maximum mana by this much (only really for spellcraft, at the moment)
    */
    actionMilestones: [
        { levels: 2, type: "mult", effect: "itemOutput", value: 1.01 },
        { levels: 5, type: "mult", effect: "actionTime", value: 1.01 },
        { levels: 20, type: "mult", effect: "xpGain", value: 1.1 },
    ],

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
            unlockCosts: [{ amount: 1e2, item: "item:loose_notes" }, { amount: 1e1, item: "currency:coins" }]
        },
        {
            id: "action:translate_ancient_scrolls",
            tier: 3,
            produces: ["item:translated_scrolls"],
            unlockCosts: [{ amount: 2e2, item: "item:bound_notes" }, { amount: 5e1, item: "currency:coins" }]
        },
        {
            id: "action:examine_arcane_manuscripts",
            tier: 4,
            produces: ["item:arcane_manuscript"],
            unlockCosts: [{ amount: 3e2, item: "item:translated_scrolls" }, { amount: 2e2, item: "currency:coins" }]
        },
        {
            id: "action:decipher_sealed_tomes",
            tier: 5,
            produces: ["item:sealed_grimoire"],
            unlockCosts: [{ amount: 4e2, item: "item:arcane_manuscript" }, { amount: 5e2, item: "currency:coins" }]
        },
        {
            id: "action:explore_lost_archives",
            tier: 6,
            produces: ["item:lost_archive_record"],
            unlockCosts: [{ amount: 5e2, item: "item:sealed_grimoire" }, { amount: 2e3, item: "currency:coins" }]
        },
        {
            id: "action:recover_forgotten_texts",
            tier: 7,
            produces: ["item:forgotten_texts"],
            unlockCosts: [{ amount: 6e2, item: "item:lost_archive_record" }, { amount: 5e3, item: "currency:coins" }]
        },
        {
            id: "action:investigate_forbidden_lore",
            tier: 8,
            produces: ["item:forbidden_codex"],
            unlockCosts: [{ amount: 7e2, item: "item:forgotten_texts" }, { amount: 2e4, item: "currency:coins" }]
        },
        {
            id: "action:unravel_primordial_mysteries",
            tier: 9,
            produces: ["item:primordial_chronicle"],
            unlockCosts: [{ amount: 8e2, item: "item:forbidden_codex" }, { amount: 5e4, item: "currency:coins" }]
        },
        {
            id: "action:research_the_first_truth",
            tier: 10,
            produces: ["item:genesis_testament"],
            unlockCosts: [{ amount: 9e2, item: "item:primordial_chronicle" }, { amount: 2e5, item: "currency:coins" }]
        },
    ],
}