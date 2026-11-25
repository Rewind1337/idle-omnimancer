// Combat is a passive world activity. Enemy balance lives here while each
// area's lineup and reward pool remain attached to its world-data record.
import { WORLD_DATA } from "./worldData"
import { COMPANION_DATA_BY_CONTAINER_ID } from "./companionData"

const ENEMY_ARCHETYPES = {
    average: { label: "Average", healthMultiplier: 1, damageMultiplier: 1, intervalMultiplier: 1 },
    strong: { label: "Strong", healthMultiplier: 1.1, damageMultiplier: 1.5, intervalMultiplier: 1.25 },
    quick: { label: "Quick", healthMultiplier: 0.85, damageMultiplier: 0.75, intervalMultiplier: 0.7 },
    tank: { label: "Tank", healthMultiplier: 1.8, damageMultiplier: 0.65, intervalMultiplier: 1.2 },
}

export const COMBAT_CONFIG = {
    id: "skill:combat",
    variant: "combat",
    activity: "passive",

    unlockCosts: [
        { item: "item:earth_catalyst_ii", amount: 25 },
        { item: "item:air_catalyst_ii", amount: 25 },
        { item: "item:water_catalyst_ii", amount: 25 },
        { item: "item:mossbound_ore", amount: 250 },
        { item: "item:whispering_seeds", amount: 250 },
        { item: "item:stillwater_reeds", amount: 250 },
        { item: "currency:coins", amount: 25000 },
    ],

    skillXP: { firstLevelXP: 3 },
    actionXP: { base: 12, perTier: 5 },
    neededXP: {
        base: 16,
        perTier: 7,
        perLevelMult: 1.126,
        perLevelFlat: 2,
        perTierMult: 1.001,
        finalMultPerLevel: 0.999,
    },

    skillProgression: [
        { reach: "skill:exploration", type: "mult", effect: "xpGain", value: 1.01 },
    ],

    milestones: [
        { level: 10, reach: "local", type: "mult", effect: "combatDamage", value: 1.1 },
        { level: 20, reach: "skill:exploration", type: "mult", effect: "actionTime", value: 1.1 },
        { level: 30, reach: "global", type: "mult", effect: "itemOutput", value: 1.2 },
        { level: 40, reach: "local", type: "mult", effect: "combatHealth", value: 1.25 },
        { level: 50, reach: "skill:companions", type: "flat", effect: "baseGoldCost", value: -2 },
    ],

    actionMilestones: [
        { levels: 5, type: "mult", effect: "combatDamage", value: 1.01 },
        { levels: 10, type: "mult", effect: "combatInterval", value: 0.99 },
        { levels: 20, type: "mult", effect: "artifactChance", value: 1.02 },
    ],

    // The player and enemies use independent five-second attack baselines.
    timing: {
        playerAttackIntervalMs: 5000,
        encounterDelayMs: 5000,
    },

    player: {
        baseHealth: 100,
        baseBarrier: 5,
        omniboltTier: 1,
        damagePerTier: 5,
        initialRotationSlots: 1,
        maxRotationSlots: 3,
    },

    enemyScaling: {
        baseHealth: 22,
        baseDamage: 2,
        healthPerArea: 1.08,
        damagePerArea: 1.045,
        variance: 0.05,
        baseAttackIntervalMs: 5000,
        intervalReductionPerAreaMs: 50,
        minimumAttackIntervalMs: 1000,
    },

    enemyArchetypes: ENEMY_ARCHETYPES,

    elementalMatchups: {
        counters: { earth: "water", water: "air", air: "earth" },
        advantageMultiplier: 1.25,
        disadvantageMultiplier: 0.75,
        neutralMultiplier: 1,
    },

    // Exploration progression improves encounter XP and non-artifact output.
    explorationLevelBonusPerLevel: 0.01,

    actions: WORLD_DATA.areas.map(area => ({
        id: "action:combat_" + area.id.replace(/^area:/, ""),
        areaId: area.id,
        areaNumber: area.areaNumber,
        name: area.name,
        tier: area.tier,
        element: area.element ?? "neutral",
        enemyLineup: area.combat?.enemyLineup ?? [{ archetype: "average" }],
        rewards: area.combat?.produces ?? [],
        artifactId: area.combat?.artifactId ?? null,
        explorationRewards: (area.exploration?.produces ?? []).filter(reward => {
            const itemId = typeof reward === "string" ? reward : reward?.item
            return itemId && !COMPANION_DATA_BY_CONTAINER_ID[itemId]
        }),
        unlockedByDefault: true,
    })),
}

export const COMBAT_ACTION_BY_ID = Object.fromEntries(
    COMBAT_CONFIG.actions.map(action => [action.id, action])
)

export const COMBAT_ACTION_BY_AREA_ID = Object.fromEntries(
    COMBAT_CONFIG.actions.map(action => [action.areaId, action])
)
