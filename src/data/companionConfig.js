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
    slotDefinitions: {
        any: { name: "Any Element", element: null, unlockedByDefault: true, unlockCost: 0 },
        earth: { name: "Earth", element: "earth", unlockedByDefault: false, unlockCost: 1000000 },
        air: { name: "Air", element: "air", unlockedByDefault: false, unlockCost: 2000000 },
        water: { name: "Water", element: "water", unlockedByDefault: false, unlockCost: 3000000 },
    },
    companionLeveling: {
        maxLevel: 100,
        effectStartingBonus: 0.05,
        neededXP: {
            base: 20,
            tierMultiplier: 1.5,
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
            companionTraining: { coinsPerCombinedLevel: 10 },
            unlockedByDefault: true,
        },
    ],
    actionXP: { base: 5, perTier: 0 },
    neededXP: {
        base: 50,
        perTier: 0,
        perLevelMult: 1.1,
        perLevelFlat: 2,
        perTierMult: 1,
        finalMultPerLevel: 1,
    },
    milestones: [],
    actionMilestones: [
        { levels: 5, type: "mult", effect: "actionTime", value: 1.02 },
        { levels: 10, type: "mult", effect: "xpGain", value: 1.035 },
        { levels: 20, type: "flat", effect: "baseGoldCost", value: -1 },
    ],
}


// Slot order and empty assignments derive from the definitions above.
// Adding a slot here automatically makes it available to state and the UI.
export const COMPANION_SLOT_IDS = Object.keys(COMPANION_CONFIG.slotDefinitions)

export const COMPANION_DEFAULT_UNLOCKED_SLOT_IDS = COMPANION_SLOT_IDS.filter(slotId =>
    COMPANION_CONFIG.slotDefinitions[slotId].unlockedByDefault
)

export const createEmptyActiveCompanionSlots = () =>
    Object.fromEntries(COMPANION_SLOT_IDS.map(slotId => [slotId, null]))
