import { WORLD_DATA } from "./worldData"

// Exploration tuning is an initial proposal. The game document intentionally
// leaves durations, XP, rewards, area count and unlock quantities open for review.

export const EXPLORATION_CONFIG = {
    id: "skill:exploration",
    variant: "exploration",

    // Uses a different Research material and refined elemental goods from Transmutation.
    // The 10,000 Coin cost is twice the current Transmutation unlock cost.
    unlockCosts: [
        { item: "item:translated_scrolls", amount: 100 },
        { item: "item:earth_catalyst_i", amount: 25 },
        { item: "item:air_catalyst_i", amount: 25 },
        { item: "item:water_catalyst_i", amount: 25 },
        { item: "currency:coins", amount: 10000 },
    ],

    artifactChance: {
        base: 0.001,
    },

    companionChance: {
        base: 0.001,
    },

    skillXP: {
        firstLevelXP: 3,
    },

    // Provisional starting values; area tier increases duration and XP.
    time: {
        base: 6,
        perTier: 1,
    },

    actionXP: {
        base: 12,
        perTier: 5,
    },

    neededXP: {
        base: 25,
        perTier: 10,
        perLevelMult: 1.126,
        perLevelFlat: 2,
        perTierMult: 1.001,
        finalMultPerLevel: 0.999,
    },

    milestones: [
        { level: 10, reach: "local", type: "mult", effect: "actionTime", value: 1.1 },
    ],

    // Each area is its own action. These milestones are intended to affect the
    // same area's future Combat and discovery systems.
    actionMilestones: [],

    // Each area's guaranteed resources and chance-based discoveries share one
    // produces list. Only guaranteed item entries feed the current action loop.
    actions: WORLD_DATA.areas.map(area => {

        return {
            id: area.actionId,
            areaId: area.id,
            name: area.name,
            tier: area.tier,
            element: area.element,
            produces: area.exploration.produces,
            unlockCosts: area.exploration.unlockCosts,
            unlockedByDefault: area.unlockedByDefault,
        }
    }),
}
