import { RESEARCH_CONFIG } from "./researchConfig"
import { SPELLCRAFT_CONFIG } from "./spellcraftConfig"
import { TRANSMUTATION_CONFIG } from "./transmutationConfig"
import { EXPLORATION_CONFIG } from "./explorationConfig"
import { UNVEILING_CONFIG } from "./unveilingConfig"
import { COMPANION_CONFIG } from "./companionConfig"
import { COMBAT_CONFIG } from "./combatConfig"

// Shared progression limits. Keep these in one place so the save state,
// progression tables and game engine all use the same maximum levels.
export const GLOBAL_CONFIG = {
    maxSkillLevel: 100,
    maxActionLevel: 100,

    // Inventory capacity and the stepped cost of buying additional slots.
    startingBagSpace: 25,
    bagSlotStartingCost: 1000,
}

// Generate the XP table for one action tier.
export const generateActionXPTable = (config, tier) => {
    const table = []
    const baseXP = config.neededXP.base + config.neededXP.perTier * (tier - 1)
    const perLevelMult = config.neededXP.perLevelMult *
        Math.pow(config.neededXP.perTierMult, tier - 1)

    let totalXP = 0

    for (let level = 1; level <= GLOBAL_CONFIG.maxActionLevel; level++) {
        const neededXP = Math.ceil(
            (baseXP * Math.pow(perLevelMult, level - 1) +
                config.neededXP.perLevelFlat * (level - 1)) *
            Math.pow(config.neededXP.finalMultPerLevel, level - 1)
        )

        table.push({
            level,
            neededXP: level === GLOBAL_CONFIG.maxActionLevel ? null : neededXP,
            totalXP,
        })

        if (level < GLOBAL_CONFIG.maxActionLevel) totalXP += neededXP
    }

    return table
}

// Skill XP is derived from the combined action-level progress. This table
// converts that total into the skill's level and its remaining XP.
export const generateSkillXPTable = (config) => {
    const maxSkillLevel = GLOBAL_CONFIG.maxSkillLevel

    if (config.progression?.type === "companionLevels") {
        const maxXP = config.progression.companionCount * config.companionLeveling.maxLevel
        return Array.from({ length: maxSkillLevel }, (_, index) => {
            const level = index + 1
            const totalXP = level === maxSkillLevel
                ? maxXP
                : Math.floor((level - 1) * maxXP / (maxSkillLevel - 1))
            const nextTotalXP = level === maxSkillLevel
                ? null
                : Math.floor(level * maxXP / (maxSkillLevel - 1))

            return {
                level,
                neededXP: nextTotalXP === null ? null : nextTotalXP - totalXP,
                totalXP,
            }
        })
    }
    const maxActionLevel = GLOBAL_CONFIG.maxActionLevel
    const actionCount = config.actions.length
    const firstLevelXP = config.skillXP.firstLevelXP
    const maxXP = actionCount * (maxActionLevel - 1)
    const levelUps = maxSkillLevel - 1
    const averageXP = maxXP / levelUps

    if (levelUps < 1 || averageXP < 1) {
        throw new Error(`Not enough action progression to generate Skill XP for ${config.id}.`)
    }

    if (!Number.isFinite(firstLevelXP) || firstLevelXP <= 0 || firstLevelXP > averageXP) {
        throw new Error(`Invalid starting Skill XP requirement for ${config.id}.`)
    }

    const endingXP = 2 * averageXP - firstLevelXP

    const getTotalXP = (level) => {
        const completedLevels = level - 1

        if (completedLevels === 0) return 0
        if (completedLevels === levelUps) return maxXP

        const total =
            completedLevels * firstLevelXP +
            ((endingXP - firstLevelXP) * completedLevels * (completedLevels - 1)) /
            (2 * (levelUps - 1))

        return Math.floor(total)
    }

    return Array.from({ length: maxSkillLevel }, (_, index) => {
        const level = index + 1
        const totalXP = getTotalXP(level)
        const nextTotalXP = level === maxSkillLevel ? null : getTotalXP(level + 1)

        return {
            level,
            neededXP: nextTotalXP === null ? null : nextTotalXP - totalXP,
            totalXP,
        }
    })
}

// Register skills here as they are implemented. Future active and passive
// skills can use the same progression/state infrastructure without changing it.
export const SKILL_CONFIGS = [
    RESEARCH_CONFIG,
    SPELLCRAFT_CONFIG,
    TRANSMUTATION_CONFIG,
    EXPLORATION_CONFIG,
    UNVEILING_CONFIG,
    COMBAT_CONFIG,
    COMPANION_CONFIG,
]

export const SKILL_CONFIG_BY_ID = Object.fromEntries(
    SKILL_CONFIGS.map(skill => [skill.id, skill])
)

// Tables are generated once at module initialization and then reused.
export const ACTION_XP_TABLES = Object.fromEntries(
    SKILL_CONFIGS.flatMap(skill =>
        skill.actions.map(action => [
            action.id,
            generateActionXPTable(skill, action.tier),
        ])
    )
)

export const SKILL_XP_TABLES = Object.fromEntries(
    SKILL_CONFIGS.map(skill => [skill.id, generateSkillXPTable(skill)])
)

export const getActionXPTable = (actionId) => ACTION_XP_TABLES[actionId]
export const getSkillXPTable = (skillId) => SKILL_XP_TABLES[skillId]
