// Unveiling consumes selected inventory items to reveal what is hidden within them.
import { COMPANION_IDS } from "./companionData"

export { COMPANION_IDS }

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

    // Study time scales with the selected item's tier.
    time: { base: 6, perTier: 1 },

    // Study actions calculate XP from the selected item's value.
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
        experienceItemsByElement: {
            earth: "item:earth_companion_xp",
            air: "item:air_companion_xp",
            water: "item:water_companion_xp",
            neutral: "item:neutral_companion_xp",
        },
    },

    actions: [
        {
            id: "action:destroy_research_books",
            name: "Study Research Materials",
            tier: 1,
            inputSelection: { groups: ["research"] },
            durationBySelectedItemTier: true,
            xpFormula: { type: "itemBaseValuePower", exponent: 0.7 },
            unlockedByDefault: true,
        },
        {
            id: "action:destroy_spellcraft_materials",
            name: "Study Spellcraft Materials",
            tier: 1,
            unlockCosts: [{ item: "currency:coins", amount: 50000 }],
            inputSelection: { groups: ["spellcraft"] },
            durationBySelectedItemTier: true,
            xpFormula: { type: "itemBaseValuePower", exponent: 0.7 },
        },
        {
            id: "action:destroy_transmutation_materials",
            name: "Study Transmutation Materials",
            tier: 1,
            unlockCosts: [{ item: "currency:coins", amount: 100000 }],
            inputSelection: { groups: ["transmutation"] },
            durationBySelectedItemTier: true,
            xpFormula: { type: "itemBaseValuePower", exponent: 0.7 },
        },
        {
            id: "action:destroy_exploration_materials",
            name: "Study Exploration Materials",
            tier: 1,
            unlockCosts: [{ item: "currency:coins", amount: 200000 }],
            inputSelection: { groups: ["exploration"] },
            durationBySelectedItemTier: true,
            xpFormula: { type: "itemBaseValuePower", exponent: 0.7 },
        },
        {
            id: "action:destroy_combat_materials",
            name: "Study Combat Materials",
            tier: 1,
            unlockCosts: [{ item: "currency:coins", amount: 400000 }],
            inputSelection: { groups: ["combat"], excludeTypes: ["unidentifiedArtifact"] },
            durationBySelectedItemTier: true,
            xpFormula: { type: "itemBaseValuePower", exponent: 0.7 },
        },
        {
            id: "action:unveil_artifact_or_companion",
            name: "Unveil Artifact or Companion",
            tier: 1,
            time: { base: 15, perTier: 0 },
            actionXPReward: 50,
            inputSelection: { types: ["companionContainer", "unidentifiedArtifact"] },
            processesCompanionContainers: true,
            processesUnidentifiedArtifacts: true,
            identificationChance: 0.1,
            unlockedByDefault: true,
        },
    ],
}
