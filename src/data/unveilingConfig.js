// Unveiling consumes selected inventory items to reveal what is hidden within them.
export const COMPANION_IDS = [
    "companion:earth",
    "companion:air",
    "companion:water",
]

export const UNVEILING_CONFIG = {
    id: "skill:unveiling",
    variant: "unveiling",

    unlockCosts: [
        { item: "item:mossbound_ore", amount: 5 },
        { item: "item:whispering_seeds", amount: 5 },
        { item: "item:stillwater_reeds", amount: 5 },
        { item: "currency:coins", amount: 10000 },
    ],

    skillXP: { firstLevelXP: 3 },

    // Destruction time scales with the selected item's tier.
    time: { base: 6, perTier: 1 },

    // Material Destruction actions calculate XP from the selected item's value.
    actionXP: { base: 1, perTier: 0 },

    neededXP: {
        base: 20,
        perTier: 0,
        perLevelMult: 1.12,
        perLevelFlat: 2,
        perTierMult: 1,
        finalMultPerLevel: 0.999,
    },

    milestones: [],
    actionMilestones: [],

    companionRewards: {
        companionIdsByElement: {
            earth: "companion:earth",
            air: "companion:air",
            water: "companion:water",
        },
        experienceItemsByElement: {
            earth: "item:earth_companion_xp",
            air: "item:air_companion_xp",
            water: "item:water_companion_xp",
        },
        commonItem: "item:faded_trinket",
        experienceChance: 0.5,
    },

    actions: [
        {
            id: "action:destroy_research_books",
            name: "Destroy Research Books",
            tier: 1,
            inputSelection: { groups: ["research"] },
            durationBySelectedItemTier: true,
            xpFormula: { type: "itemBaseValuePower", exponent: 0.7 },
            unlockedByDefault: true,
        },
        {
            id: "action:destroy_spellcraft_materials",
            name: "Destroy Spellcraft Materials",
            tier: 1,
            inputSelection: { groups: ["spellcraft"] },
            durationBySelectedItemTier: true,
            xpFormula: { type: "itemBaseValuePower", exponent: 0.7 },
        },
        {
            id: "action:destroy_transmutation_materials",
            name: "Destroy Transmutation Materials",
            tier: 1,
            inputSelection: { groups: ["transmutation"] },
            durationBySelectedItemTier: true,
            xpFormula: { type: "itemBaseValuePower", exponent: 0.7 },
        },
        {
            id: "action:destroy_exploration_materials",
            name: "Destroy Exploration Materials",
            tier: 1,
            inputSelection: { groups: ["exploration"] },
            durationBySelectedItemTier: true,
            xpFormula: { type: "itemBaseValuePower", exponent: 0.7 },
        },
        {
            id: "action:destroy_combat_materials",
            name: "Destroy Combat Materials",
            tier: 1,
            inputSelection: { groups: ["combat"] },
            durationBySelectedItemTier: true,
            xpFormula: { type: "itemBaseValuePower", exponent: 0.7 },
        },
        {
            id: "action:unveil_artifact_or_companion",
            name: "Unveil Artifact or Companion",
            tier: 1,
            time: { base: 15, perTier: 0 },
            actionXPReward: 50,
            // Unidentified objects will be added when Combat defines their item and reward data.
            inputSelection: { types: ["companionContainer"], maxTier: 1 },
            processesCompanionContainers: true,
            unlockedByDefault: true,
        },
    ],
}
