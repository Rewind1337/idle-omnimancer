import { COMPANION_DATA } from "./companionData"

// Companion levels are independent. Their total levels determine the skill's
// progression, while the single action trains every companion in an active slot.
export const COMPANION_CONFIG = {
    id: "skill:companions",
    variant: "companions",
    activity: "active",
    progression: {
        type: "companionLevels",
        companionCount: COMPANION_DATA.length,
    },
    slots: {
        earth: { unlockedByDefault: true, unlockCost: 0 },
        air: { unlockedByDefault: false, unlockCost: 10000000 },
        water: { unlockedByDefault: false, unlockCost: 100000000 },
    },
    companionLeveling: {
        maxLevel: 100,
        neededXP: {
            base: 20,
            perLevelMult: 1.1,
            perLevelFlat: 2,
        },
    },
    actions: [
        {
            id: "action:tend_companions",
            name: "Tend to Companions",
            tier: 1,
            time: { base: 5, perTier: 0 },
            consumes: [{ item: "currency:coins", amount: 20 }],
            companionTraining: { xpPerCompanion: 5 },
            tracksProgress: false,
            unlockedByDefault: true,
        },
    ],
    // The action uses no action-level progression, so these tables are never
    // shown or applied. They exist only to keep shared skill registration uniform.
    actionXP: { base: 0, perTier: 0 },
    neededXP: {
        base: 20,
        perTier: 0,
        perLevelMult: 1.1,
        perLevelFlat: 2,
        perTierMult: 1,
        finalMultPerLevel: 1,
    },
    milestones: [],
    actionMilestones: [],
}
