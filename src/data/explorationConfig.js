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
        { item: "item:earth_catalyst_i", amount: 5 },
        { item: "item:air_catalyst_i", amount: 5 },
        { item: "item:water_catalyst_i", amount: 5 },
        { item: "currency:coins", amount: 10000 },
    ],

    skillXP: {
        firstLevelXP: 3,
    },

    // Provisional starting values; area tier increases duration and XP.
    time: {
        base: 6,
        perTier: 2,
    },

    actionXP: {
        base: 10,
        perTier: 5,
    },

    neededXP: {
        base: 24,
        perTier: 10,
        perLevelMult: 1.14,
        perLevelFlat: 2,
        perTierMult: 1.001,
        finalMultPerLevel: 0.999,
    },

    milestones: [
        { level: 10, reach: "local", type: "mult", effect: "actionTime", value: 1.1 },
        { level: 20, reach: "skill:combat", type: "mult", effect: "combatOutput", value: 1.1 },
        { level: 30, reach: "skill:combat", type: "mult", effect: "combatXP", value: 1.1 },
        { level: 40, reach: "skill:combat", type: "mult", effect: "artifactChance", value: 1.05 },
    ],

    // Each area is its own action. These milestones are intended to affect the
    // same area's future Combat and discovery systems.
    actionMilestones: [
        { levels: 10, type: "mult", effect: "combatOutput", value: 1.02 },
        { levels: 10, type: "mult", effect: "combatXP", value: 1.02 },
        { levels: 20, type: "mult", effect: "artifactChance", value: 1.05 },
        { levels: 20, type: "mult", effect: "companionContainerChance", value: 1.05 },
    ],

    // The shared map is the source of truth for area identity, position, links,
    // resources, container discoveries and Combat artifacts.
    actions: WORLD_DATA.areas.map(area => ({
        id: area.actionId,
        areaId: area.id,
        name: area.name,
        tier: area.tier,
        element: area.element,
        produces: area.exploration.resourceRewards,
        companionContainer: area.exploration.companionContainer,
        artifactItem: area.combat.artifactItem,
        unlockedByDefault: area.unlockedByDefault,
    })),
}
