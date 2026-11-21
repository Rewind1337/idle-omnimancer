import {
    GLOBAL_CONFIG,
    SKILL_CONFIGS,
    SKILL_CONFIG_BY_ID,
    getActionXPTable,
    getSkillXPTable,
} from "../data/skillConfig"
import { ITEM_DATA_BY_ID, SHOP_ITEM_DATA_BY_ID } from "../data/itemData"
import { SKILL_NAVIGATION } from "../data/navigationData"
import { humanize } from "../utility/helpers"



// The first additional bag slot costs the configured base price. Every
// purchased slot increases the next price by the configured multiplier.
export const getNextBagSlotCost = (inventorySlots = GLOBAL_CONFIG.startingBagSpace) => {
    const purchasedSlots = Math.max(
        0,
        Math.floor(inventorySlots) - GLOBAL_CONFIG.startingBagSpace
    )
    const cost = GLOBAL_CONFIG.bagSlotStartingCost *
        Math.pow(GLOBAL_CONFIG.bagSlotCostMultiplier, purchasedSlots)

    return Number.isFinite(cost) ? Math.ceil(cost) : Infinity
}

// Shop goods can be bought repeatedly, but a new item type still needs a free bag slot.
export const canBuyShopItem = (player, itemId) => {
    const item = SHOP_ITEM_DATA_BY_ID[itemId]
    const coins = player.currencies?.coins ?? 0
    if (!item || !Number.isFinite(item.shopPrice) || item.shopPrice < 0 || coins < item.shopPrice) return false
    if ((player.inventory?.[itemId] ?? 0) > 0) return true

    const occupiedSlots = Object.entries(player.inventory ?? {})
        .filter(([inventoryItemId, amount]) => ITEM_DATA_BY_ID[inventoryItemId] && amount > 0)
        .length
    const inventorySlots = player.inventorySlots ?? GLOBAL_CONFIG.startingBagSpace
    return occupiedSlots < inventorySlots
}

// Resolve the next action in the configured progression order.
const getNextLockedAction = (player, skillId) => {
    const skill = SKILL_CONFIG_BY_ID[skillId]
    if (!skill) return null

    const actionStates = player.skills[skillId]?.actions ?? {}
    return skill.actions.find(action => !actionStates[action.id]?.unlocked) ?? null
}

// Show every unlocked action and preview only the next locked action in config
// order, even when multiple elemental actions share the same tier.
export const getVisibleActions = (player, skillId) => {
    const skill = SKILL_CONFIG_BY_ID[skillId]
    if (!skill) return []

    const actionStates = player.skills[skillId]?.actions ?? {}
    const nextLockedAction = getNextLockedAction(player, skillId)

    return skill.actions.filter(action =>
        actionStates[action.id]?.unlocked || action.id === nextLockedAction?.id
    )
}

const getUnlockCostTotals = (unlockCosts = []) => {
    if (!Array.isArray(unlockCosts)) return null

    const totals = {}
    for (const cost of unlockCosts) {
        if (typeof cost?.item !== "string" || !cost.item || !Number.isFinite(cost.amount) || cost.amount < 0) return null
        totals[cost.item] = (totals[cost.item] ?? 0) + cost.amount
    }
    return totals
}

const getUnlockCostBalance = (player, itemId) => {
    if (itemId.startsWith("currency:")) {
        return player.currencies?.[itemId.slice("currency:".length)] ?? 0
    }
    return player.inventory?.[itemId] ?? 0
}

// Action inputs support the same string and { item, amount } formats as the
// resource display. Invalid requirements fail safely instead of being ignored.
const getActionConsumeTotals = (action) => {
    const totals = {}

    for (const entry of Array.isArray(action.consumes) ? action.consumes : []) {
        const itemId = typeof entry === "string" ? entry : entry?.item
        const amount = typeof entry === "string" ? 1 : (entry?.amount ?? 1)

        if (
            typeof itemId !== "string" ||
            !itemId ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) return null

        totals[itemId] = (totals[itemId] ?? 0) + amount
    }

    return totals
}


// Normalize action outputs so string and quantity-based config entries
// share the same output and inventory-capacity handling.
const getActionOutputs = (action) => {
    const outputs = action.produces ?? action.outputItem ?? []
    const entries = Array.isArray(outputs) ? outputs : [outputs]

    return entries
        .filter(Boolean)
        .map(output => typeof output === "string"
            ? { item: output, amount: 1 }
            : { item: output.item, amount: output.amount ?? 1 })
        .filter(output => typeof output.item === "string" &&
            output.item.length > 0 &&
            Number.isFinite(output.amount) &&
            output.amount > 0)
}

// Trace the configured production and consumption paths for an item. This is
// intentionally based on base action amounts, before any runtime multipliers.
export const getItemActionSources = (itemId) => {
    const obtainedBy = []
    const consumedBy = []

    for (const skill of SKILL_CONFIGS) {
        if (Array.isArray(skill.unlockCosts)) {
            const skillCost = skill.unlockCosts
                .filter(cost => cost.item === itemId)
                .reduce((total, cost) => total + (cost.amount ?? 0), 0)

            if (skillCost > 0) {
                consumedBy.push({
                    id: "skill-unlock-" + skill.id,
                    name: humanize(skill.id),
                    amount: skillCost,
                    type: "unlock",
                    badgeVariant: skill.variant
                })
            }
        }

        for (const action of skill.actions) {
            const actionName = action.name ?? humanize(action.id)
            const outputAmount = getActionOutputs(action)
                .filter(output => output.item === itemId)
                .reduce((total, output) => total + output.amount, 0)

            if (outputAmount > 0) {
                obtainedBy.push({
                    id: "obtain-" + skill.id + "-" + action.id,
                    name: actionName,
                    amount: outputAmount,
                    type: "action",
                    badgeVariant: skill.variant
                })
            }

            const consumedAmount = getActionConsumeTotals(action)?.[itemId] ?? 0
            if (consumedAmount > 0) {
                consumedBy.push({
                    id: "consume-" + skill.id + "-" + action.id,
                    name: actionName,
                    amount: consumedAmount,
                    type: "action",
                    badgeVariant: skill.variant
                })
            }

            const unlockAmount = (action.unlockCosts ?? [])
                .filter(cost => cost.item === itemId)
                .reduce((total, cost) => total + (cost.amount ?? 0), 0)

            if (unlockAmount > 0) {
                consumedBy.push({
                    id: "action-unlock-" + skill.id + "-" + action.id,
                    name: actionName,
                    amount: unlockAmount,
                    type: "unlock",
                    badgeVariant: skill.variant
                })
            }
        }
    }

    return { obtainedBy, consumedBy }
}

// Each distinct item type occupies one slot; additional copies stack.
const canStoreActionOutputs = (player, skill, action) => {
    const inventory = player.inventory ?? {}
    const occupiedSlots = Object.entries(inventory)
        .filter(([itemId, amount]) => ITEM_DATA_BY_ID[itemId] && amount > 0)
        .length
    const outputMultiplier = getActionOutputMultiplier(player, skill, action)
    const possibleItemIds = outputMultiplier > 0
        ? getActionOutputs(action).map(output => output.item)
        : []
    const companionContainerId = typeof action.companionContainer === "string"
        ? action.companionContainer
        : action.companionContainer?.item
    if (
        outputMultiplier > 0 &&
        skill.companionChance?.base > 0 &&
        companionContainerId &&
        ITEM_DATA_BY_ID[companionContainerId]
    ) {
        possibleItemIds.push(companionContainerId)
    }
    const newItemIds = [...new Set(possibleItemIds)]
        .filter(itemId => ITEM_DATA_BY_ID[itemId] && !(inventory[itemId] > 0))
    const inventorySlots = Number.isFinite(player.inventorySlots)
        ? Math.max(0, player.inventorySlots)
        : GLOBAL_CONFIG.startingBagSpace

    return occupiedSlots + newItemIds.length <= inventorySlots
}

export const canUnlockSkill = (player, skillId) => {
    const skill = SKILL_CONFIG_BY_ID[skillId]
    if (
        !skill ||
        player.unlockedSkills?.includes(skillId) ||
        !Array.isArray(skill.unlockCosts) ||
        skill.unlockCosts.length === 0
    ) return false

    const costs = getUnlockCostTotals(skill.unlockCosts)
    if (!costs) return false

    return Object.entries(costs).every(([itemId, amount]) =>
        getUnlockCostBalance(player, itemId) >= amount
    )
}

export const canUnlockAction = (player, skillId, actionId) => {
    if (!player.unlockedSkills?.includes(skillId)) return false
    const skill = SKILL_CONFIG_BY_ID[skillId]
    const action = skill?.actions.find(entry => entry.id === actionId)
    // Older in-memory sessions may not yet contain actions added by newer
    // world-data updates. Treat a missing entry as its configured initial state.
    const actionState = player.skills?.[skillId]?.actions?.[actionId] ?? {
        unlocked: Boolean(action?.unlockedByDefault),
    }
    if (!action || actionState.unlocked) return false

    if (skill.unlockRule === "adjacent") {
        const targetPosition = action.position
        if (!targetPosition) return false

        const hasUnlockedNeighbor = skill.actions.some(otherAction => {
            if (otherAction.id === actionId || !otherAction.position) return false
            if (!player.skills?.[skillId]?.actions?.[otherAction.id]?.unlocked) return false

            const deltaQ = targetPosition.q - otherAction.position.q
            const deltaR = targetPosition.r - otherAction.position.r
            const hexDistance = (
                Math.abs(deltaQ) + Math.abs(deltaR) + Math.abs(deltaQ + deltaR)
            ) / 2

            return hexDistance === 1
        })
        if (!hasUnlockedNeighbor) return false
    } else {
        // Other skills retain sequential unlocks so later actions cannot be skipped.
        if (getNextLockedAction(player, skillId)?.id !== actionId) return false
    }

    const costs = getUnlockCostTotals(action.unlockCosts)
    if (!costs) return false
    return Object.entries(costs).every(([itemId, amount]) =>
        getUnlockCostBalance(player, itemId) >= amount
    )
}

export const getSkillProgress = (player, skillId) => {
    const skill = SKILL_CONFIG_BY_ID[skillId]
    const table = getSkillXPTable(skillId)
    if (!skill || !table) return null

    // Skill XP intentionally comes from completed action levels only. Partial
    // action XP does not contribute until that action actually levels up.
    const totalXP = skill.actions.reduce((total, action) => {
        const level = player.skills[skillId]?.actions[action.id]?.level ?? 1
        return total + (level - 1)
    }, 0)

    let current = table[0]
    for (const entry of table) {
        if (entry.totalXP > totalXP) break
        current = entry
    }

    return {
        level: current.level,
        xp: totalXP - current.totalXP,
        neededXP: current.neededXP,
        totalXP,
        maxXP: table[table.length - 1].totalXP,
    }
}

// Convert configured milestone rewards into additive bonuses for one target skill.
// "mult" values are expressed as multipliers (1.1 = +10%); their bonus portions
// add together, matching the default stacking rule in the game design document.
const addMilestoneBonus = (totals, milestone, count = 1) => {
    const { effect, type, value } = milestone
    if (
        typeof effect !== "string" ||
        !Number.isFinite(value) ||
        !Number.isFinite(count) ||
        count <= 0
    ) return

    const effectTotals = totals[effect] ?? { flat: 0, mult: 0 }
    if (type === "flat") effectTotals.flat += value * count
    else if (type === "mult") effectTotals.mult += (value - 1) * count
    else return

    totals[effect] = effectTotals
}

const getSkillName = (skillId) => {
    const navigationEntry = SKILL_NAVIGATION.find(entry => entry.skillId === skillId)
    if (navigationEntry) return navigationEntry.name

    return skillId.replace("skill:", "").split("_")
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
}

const milestoneTargetsSkill = (sourceSkill, targetSkillId, milestone) =>
    milestone.reach === "global" ||
    (milestone.reach === "local" && sourceSkill.id === targetSkillId) ||
    milestone.reach === targetSkillId

const getMilestoneTargetLabel = (sourceSkill, reach) => {
    if (reach === "global") return "All Skills"

    const targetSkillId = reach === "local" ? sourceSkill.id : reach
    const targetName = SKILL_CONFIG_BY_ID[targetSkillId]
        ? getSkillName(targetSkillId)
        : targetSkillId

    return targetName
}

const getSkillMilestoneBonuses = (player, targetSkillId, effect = null) => {
    const totals = {}

    for (const sourceSkill of Object.values(SKILL_CONFIG_BY_ID)) {
        // A skill cannot award milestones until it has actually been unlocked.
        if (!player.unlockedSkills?.includes(sourceSkill.id)) continue

        const sourceLevel = getSkillProgress(player, sourceSkill.id)?.level ?? 1

        for (const milestone of sourceSkill.milestones ?? []) {
            if (
                !Number.isFinite(milestone.level) ||
                sourceLevel < milestone.level ||
                (effect && milestone.effect !== effect)
            ) continue

            if (milestoneTargetsSkill(sourceSkill, targetSkillId, milestone)) {
                addMilestoneBonus(totals, milestone)
            }
        }
    }

    return totals
}

const getActionMilestoneBonuses = (player, skill, action) => {
    const totals = getSkillMilestoneBonuses(player, skill.id)
    const actionState = player.skills?.[skill.id]?.actions?.[action.id]
    const actionLevel = actionState?.unlocked
        ? Math.max(0, Math.floor(actionState.level ?? 1))
        : 0

    for (const milestone of skill.actionMilestones ?? []) {
        if (!Number.isFinite(milestone.levels) || milestone.levels <= 0) continue

        // Levels are counted from zero: levels: 2 awards its first stack at action level 2.
        const completedMilestones = Math.floor(actionLevel / milestone.levels)
        addMilestoneBonus(totals, milestone, completedMilestones)
    }

    return totals
}

// Tooltip records are generated from the same milestone configs used by the calculations.
export const getSkillMilestoneDetails = (player, skill) => {
    const skillLevel = getSkillProgress(player, skill.id)?.level ?? 1
    const skillUnlocked = player.unlockedSkills?.includes(skill.id) ?? false

    return (skill.milestones ?? [])
        .filter(milestone => Number.isFinite(milestone.level))
        .map((milestone, index) => {
            const active = skillUnlocked && skillLevel >= milestone.level

            return {
                id: "skill-" + skill.id + "-milestone-" + milestone.level + "-" + index,
                title: getSkillName(skill.id) + " Level " + milestone.level,
                source: getMilestoneTargetLabel(skill, milestone.reach),
                effect: milestone.effect,
                type: milestone.type,
                value: milestone.value,
                stacks: 1,
                mode: "milestone",
                active,
                status: active ? "Active" : "Unlocks at Level " + milestone.level,
                variant: skill.variant
            }
        })
}

export const getActionMilestoneDetails = (player, skill, action) => {
    const actionState = player.skills?.[skill.id]?.actions?.[action.id]
    const actionLevel = actionState?.unlocked
        ? Math.max(0, Math.floor(actionState.level ?? 1))
        : 0

    return (skill.actionMilestones ?? [])
        .filter(milestone => Number.isFinite(milestone.levels) && milestone.levels > 0)
        .map((milestone, index) => {
            const stacks = Math.floor(actionLevel / milestone.levels)
            const active = stacks > 0

            return {
                id: "action-" + skill.id + "-" + action.id + "-milestone-" + milestone.levels + "-" + index,
                title: "Every " + milestone.levels + " Levels",
                effect: milestone.effect,
                type: milestone.type,
                value: milestone.value,
                stacks,
                perStack: true,
                showStacks: true,
                mode: "milestone",
                active,
                variant: skill.variant
            }
        })
}

const getBonusForEffect = (totals, effect) =>
    totals[effect] ?? { flat: 0, mult: 0 }

export const getActionDurationMs = (skill, action, player = null) => {
    const baseSeconds = skill.time.base + skill.time.perTier * (action.tier - 1)
    const elementTimeMultiplier = skill.elementModifiers?.[action.element]?.timeMultiplier ?? 1
    const bonuses = player
        ? getBonusForEffect(getActionMilestoneBonuses(player, skill, action), "actionTime")
        : { flat: 0, mult: 0 }
    const actionSpeedMultiplier = Math.max(0.01, 1 + bonuses.mult + bonuses.flat)

    return Math.max(1, baseSeconds * elementTimeMultiplier / actionSpeedMultiplier * 1000)
}

export const getActionXPReward = (skill, action, player = null) => {
    const baseXP = skill.actionXP.base + skill.actionXP.perTier * (action.tier - 1)
    const elementXPMultiplier = skill.elementModifiers?.[action.element]?.xpMultiplier ?? 1
    const bonuses = player
        ? getBonusForEffect(getActionMilestoneBonuses(player, skill, action), "xpGain")
        : { flat: 0, mult: 0 }
    const finalXP = baseXP * elementXPMultiplier * Math.max(0, 1 + bonuses.mult) + bonuses.flat

    return Math.max(0, finalXP)
}

// Action Mana uses the configured tier curve and element modifier, then applies
// any skill/action milestone discounts targeting this action's skill.
export const getActionManaCost = (skill, action, player = null) => {
    const costConfig = skill.mana?.cost
    let baseCost = action.manaCost ?? 0

    if (costConfig) {
        const tier = Math.max(1, Math.floor(action.tier || 1))
        const multiplier = costConfig.tierMultiplier ?? 1
        const flatAdjustment = costConfig.tierFlat ?? 0
        baseCost = costConfig.base

        for (let currentTier = 2; currentTier <= tier; currentTier++) {
            baseCost = baseCost * multiplier + flatAdjustment
        }
    }

    const elementManaCostMultiplier =
        skill.elementModifiers?.[action.element]?.manaCostMultiplier ?? 1
    baseCost *= elementManaCostMultiplier

    const bonuses = player
        ? getBonusForEffect(getActionMilestoneBonuses(player, skill, action), "manaCost")
        : { flat: 0, mult: 0 }
    // Mana-cost multipliers are applied directly: 0.9 means a 10% reduction.
    const discountedCost = baseCost * Math.max(0.01, 1 + bonuses.mult) - bonuses.flat

    return Math.max(0, discountedCost)
}

export const getActionOutputMultiplier = (player, skill, action) => {
    const bonuses = getBonusForEffect(getActionMilestoneBonuses(player, skill, action), "itemOutput")
    return Math.max(0, 1 + bonuses.mult + bonuses.flat)
}

export const getActionPreservationChance = (player, skill, action) => {
    const bonuses = getBonusForEffect(getActionMilestoneBonuses(player, skill, action), "preservation")
    return Math.max(0, Math.min(1, bonuses.mult + bonuses.flat))
}

// Return active contributors from element modifiers, applicable skill milestones
// and repeated action milestones. These records are used by the action tooltips.
export const getActionEffectStacks = (player, skill, action) => {
    const effectNames = ["actionTime", "xpGain", "manaCost", "itemOutput", "preservation"]
    const elementProperties = {
        actionTime: "timeMultiplier",
        xpGain: "xpMultiplier",
        manaCost: "manaCostMultiplier",
    }
    const elementName = action.element
        ? action.element.charAt(0).toUpperCase() + action.element.slice(1)
        : null

    const getActiveEffects = (effect) => {
        const entries = []
        const elementProperty = elementProperties[effect]
        const elementValue = elementProperty
            ? skill.elementModifiers?.[action.element]?.[elementProperty]
            : null

        if (Number.isFinite(elementValue) && elementValue !== 1) {
            entries.push({
                id: "element-" + skill.id + "-" + action.id + "-" + effect,
                source: elementName + " Element Modifier",
                effect,
                type: "mult",
                value: elementValue,
                stacks: 1,
                mode: "element",
                variant: elementName.toLowerCase()
            })
        }

        for (const sourceSkill of Object.values(SKILL_CONFIG_BY_ID)) {
            if (!player.unlockedSkills?.includes(sourceSkill.id)) continue

            const sourceLevel = getSkillProgress(player, sourceSkill.id)?.level ?? 1
            for (const [milestoneIndex, milestone] of (sourceSkill.milestones ?? []).entries()) {
                if (
                    milestone.effect !== effect ||
                    !Number.isFinite(milestone.level) ||
                    sourceLevel < milestone.level ||
                    !milestoneTargetsSkill(sourceSkill, skill.id, milestone)
                ) continue

                entries.push({
                    id: "skill-" + sourceSkill.id + "-" + milestone.level + "-" + effect + "-" + milestoneIndex,
                    title: getSkillName(sourceSkill.id) + " Level " + milestone.level,
                    effect,
                    type: milestone.type,
                    value: milestone.value,
                    stacks: 1,
                    mode: "milestone",
                    variant: sourceSkill.variant
                })
            }
        }

        const actionState = player.skills?.[skill.id]?.actions?.[action.id]
        const actionLevel = actionState?.unlocked
            ? Math.max(0, Math.floor(actionState.level ?? 1))
            : 0

        for (const [milestoneIndex, milestone] of (skill.actionMilestones ?? []).entries()) {
            if (
                milestone.effect !== effect ||
                !Number.isFinite(milestone.levels) ||
                milestone.levels <= 0
            ) continue

            const stacks = Math.floor(actionLevel / milestone.levels)
            if (stacks <= 0) continue

            entries.push({
                id: "action-" + skill.id + "-" + action.id + "-" + milestone.levels + "-" + effect + "-" + milestoneIndex,
                source: (action.name ?? humanize(action.id)) + " - Level " + actionLevel,
                effect,
                type: milestone.type,
                value: milestone.value,
                stacks,
                mode: "milestone",
                variant: skill.variant
            })
        }

        return entries.filter(entry => Number.isFinite(entry.value) && entry.value !== 0)
    }

    return Object.fromEntries(effectNames.map(effect => [effect, getActiveEffects(effect)]))
}

export const getManaCapacity = (player) => {
    const skill = SKILL_CONFIG_BY_ID["skill:spellcraft"]
    if (!skill?.mana) return 0

    const skillLevel = getSkillProgress(player, skill.id)?.level ?? 1
    const levelBonus = Math.max(0, skillLevel - 1) * (skill.mana.capacityPerLevel ?? 0)
    const baseCapacity = skill.mana.base + levelBonus
    const bonuses = getBonusForEffect(
        getSkillMilestoneBonuses(player, skill.id),
        "manaCapacity"
    )
    return Math.max(0, baseCapacity * Math.max(0, 1 + bonuses.mult) + bonuses.flat)
}

export const getManaRegeneration = (player) => {
    const skill = SKILL_CONFIG_BY_ID["skill:spellcraft"]
    if (!skill?.mana) return 0

    const skillLevel = getSkillProgress(player, skill.id)?.level ?? 1
    const levelBonus = Math.max(0, skillLevel - 1) * (skill.mana.regenPerLevel ?? 0)
    const baseRegeneration = (skill.mana.regen ?? 0) + levelBonus
    const bonuses = getBonusForEffect(
        getSkillMilestoneBonuses(player, skill.id),
        "manaRegeneration"
    )
    return Math.max(0, baseRegeneration * Math.max(0, 1 + bonuses.mult) + bonuses.flat)
}

// Collect the effects that contribute specifically to Spellcraft's Mana pool.
// These include its intrinsic per-level growth and milestones from any unlocked skill.
export const getManaEffectStacks = (player) => {
    const skill = SKILL_CONFIG_BY_ID["skill:spellcraft"]
    const effectNames = ["manaCapacity", "manaRegeneration"]
    const entriesByEffect = Object.fromEntries(effectNames.map(effect => [effect, []]))

    if (!skill?.mana) return entriesByEffect

    const skillLevel = getSkillProgress(player, skill.id)?.level ?? 1
    const levelBonuses = {
        manaCapacity: Math.max(0, skillLevel - 1) * (skill.mana.capacityPerLevel ?? 0),
        manaRegeneration: Math.max(0, skillLevel - 1) * (skill.mana.regenPerLevel ?? 0),
    }

    for (const effect of effectNames) {
        const levelBonus = levelBonuses[effect]
        if (levelBonus > 0) {
            entriesByEffect[effect].push({
                id: "spellcraft-level-" + effect,
                title: "Spellcraft Level " + skillLevel,
                effect,
                type: "flat",
                value: levelBonus,
                stacks: 1,
                mode: "progression",
                variant: skill.variant,
            })
        }
    }

    for (const sourceSkill of Object.values(SKILL_CONFIG_BY_ID)) {
        if (!player.unlockedSkills?.includes(sourceSkill.id)) continue

        const sourceLevel = getSkillProgress(player, sourceSkill.id)?.level ?? 1
        for (const [milestoneIndex, milestone] of (sourceSkill.milestones ?? []).entries()) {
            if (
                !effectNames.includes(milestone.effect) ||
                !Number.isFinite(milestone.level) ||
                sourceLevel < milestone.level ||
                !milestoneTargetsSkill(sourceSkill, skill.id, milestone)
            ) continue

            entriesByEffect[milestone.effect].push({
                id: "skill-" + sourceSkill.id + "-" + milestone.level + "-" + milestone.effect + "-" + milestoneIndex,
                title: getSkillName(sourceSkill.id) + " Level " + milestone.level,
                effect: milestone.effect,
                type: milestone.type,
                value: milestone.value,
                stacks: 1,
                mode: "milestone",
                variant: sourceSkill.variant,
            })
        }
    }

    return entriesByEffect
}


export const getActionProgress = (actionState, durationMs) =>
    Math.min(100, Math.max(0, (actionState.progressMs / durationMs) * 100))

const canPayActionCost = (player, skill, action) => {
    const manaCost = getActionManaCost(skill, action, player)
    const consumeTotals = getActionConsumeTotals(action)
    if (!consumeTotals) return false

    const hasInputs = Object.entries(consumeTotals).every(([itemId, amount]) =>
        getUnlockCostBalance(player, itemId) >= amount
    )
    const hasMana = manaCost <= 0 || player.mana.current >= manaCost

    return hasInputs && hasMana
}

const payActionCost = (player, skill, action) => {
    const manaCost = getActionManaCost(skill, action, player)
    if (manaCost > 0) {
        player.mana.current = Math.max(0, player.mana.current - manaCost)
    }

    const consumeTotals = getActionConsumeTotals(action) ?? {}
    const hasInputs = Object.keys(consumeTotals).length > 0
    const preservesInputs = hasInputs &&
        Math.random() < getActionPreservationChance(player, skill, action)

    if (!preservesInputs) {
        for (const [itemId, amount] of Object.entries(consumeTotals)) {
            if (itemId.startsWith("currency:")) {
                const currencyId = itemId.slice("currency:".length)
                player.currencies[currencyId] = Math.max(
                    0,
                    (player.currencies[currencyId] ?? 0) - amount
                )
            } else {
                player.inventory[itemId] = Math.max(
                    0,
                    (player.inventory[itemId] ?? 0) - amount
                )
                if (player.inventory[itemId] === 0) delete player.inventory[itemId]
            }
        }
    }
}

const awardActionXP = (player, skill, action, actionState) => {
    const table = getActionXPTable(action.id)

    if (actionState.level < GLOBAL_CONFIG.maxActionLevel) {
        const neededXP = table[actionState.level - 1].neededXP
        actionState.xp += getActionXPReward(skill, action, player)

        // A completed action can grant at most one action level. Any XP beyond
        // that level's requirement is discarded instead of carried forward.
        if (neededXP !== null && neededXP !== undefined && actionState.xp >= neededXP) {
            actionState.level += 1
            actionState.xp = 0
        }
    }

    if (actionState.level >= GLOBAL_CONFIG.maxActionLevel) {
        actionState.level = GLOBAL_CONFIG.maxActionLevel
        actionState.xp = 0
    }

    const outputMultiplier = getActionOutputMultiplier(player, skill, action)
    for (const { item, amount } of getActionOutputs(action)) {
        const scaledAmount = amount * outputMultiplier
        const wholeAmount = Math.floor(scaledAmount)
        const fractionalAmount = scaledAmount - wholeAmount
        const outputAmount = wholeAmount +
            (fractionalAmount > 0 && Math.random() < fractionalAmount ? 1 : 0)

        if (outputAmount <= 0) continue

        if (item.startsWith("currency:")) {
            const currencyId = item.slice("currency:".length)
            player.currencies[currencyId] = (player.currencies[currencyId] ?? 0) + outputAmount
        } else if (ITEM_DATA_BY_ID[item]) {
            player.inventory[item] = (player.inventory[item] ?? 0) + outputAmount
        }
    }

    // Some areas have a chance to reveal their matching elemental container.
    const companionContainerId = typeof action.companionContainer === "string"
        ? action.companionContainer
        : action.companionContainer?.item
    // Item-output bonuses also improve the chance to discover companion containers.
    const companionChance = Math.max(
        0,
        Math.min(1, (skill.companionChance?.base ?? 0) * outputMultiplier)
    )
    if (
        companionContainerId &&
        ITEM_DATA_BY_ID[companionContainerId] &&
        companionChance > 0 &&
        Math.random() < companionChance
    ) {
        player.inventory[companionContainerId] =
            (player.inventory[companionContainerId] ?? 0) + 1
    }
}

// Advance one running action by elapsed milliseconds. The while loop handles
// delayed browser ticks and offline time that span multiple action completions.
const advanceOneAction = (player, skill, action, actionState, deltaMs, isActive) => {
    let remainingMs = deltaMs

    // Passive processes continue producing even after their progression level
    // reaches the cap. Active actions stop at their maximum level.
    while (remainingMs > 0 && (!isActive || actionState.level < GLOBAL_CONFIG.maxActionLevel)) {
        // Check Mana before starting each cycle, including automatic repeats.
        if (actionState.progressMs === 0 && !canPayActionCost(player, skill, action)) break

        const durationMs = getActionDurationMs(skill, action, player)
        const timeLeft = Math.max(0, durationMs - actionState.progressMs)
        const consumedMs = Math.min(remainingMs, timeLeft)

        actionState.progressMs += consumedMs
        remainingMs -= consumedMs

        if (actionState.progressMs + 0.0001 < durationMs) break

        // Check Mana and bag capacity before completing the action. If a new
        // item type would exceed capacity, hold the completed cycle until space
        // becomes available rather than consuming Mana or discarding output.
        if (!canPayActionCost(player, skill, action) || !canStoreActionOutputs(player, skill, action)) break
        payActionCost(player, skill, action)

        actionState.progressMs = 0
        awardActionXP(player, skill, action, actionState)
    }

    if (actionState.level >= GLOBAL_CONFIG.maxActionLevel && isActive) {
        actionState.progressMs = 0
    }
}

const advanceRunningActions = (player, deltaMs) => {
    // The game currently permits one selected active action globally.
    if (player.activeAction) {
        const { skillId, actionId } = player.activeAction
        const skill = SKILL_CONFIG_BY_ID[skillId]
        const action = skill?.actions.find(entry => entry.id === actionId)
        const actionState = player.skills[skillId]?.actions[actionId]

        if (skill && action && actionState?.unlocked) {
            const activity = action.activity ?? skill.activity ?? "active"
            if (activity === "active") {
                advanceOneAction(player, skill, action, actionState, deltaMs, true)

                // An active process stops when it reaches its level cap or can no
                // longer afford the next cycle. In the latter case, discard any
                // unfinished progress so restarting never grants a free partial cycle.
                if (
                    actionState.level >= GLOBAL_CONFIG.maxActionLevel ||
                    !canPayActionCost(player, skill, action)
                ) {
                    actionState.progressMs = 0
                    player.activeAction = null
                }
            }
        }
    }

    // Passive actions are opt-in and run independently of the active slot.
    for (const skill of Object.values(SKILL_CONFIG_BY_ID)) {
        for (const action of skill.actions) {
            const activity = action.activity ?? skill.activity ?? "active"
            if (activity !== "passive") continue

            const actionState = player.skills[skill.id]?.actions[action.id]
            if (!actionState?.unlocked || !actionState.running) continue

            advanceOneAction(player, skill, action, actionState, deltaMs, false)
        }
    }
}

// Advance all eligible systems by the actual elapsed time. The 100ms online
// tick is processed as-is. Long offline intervals are simulated in 1-second
// slices so regenerated resources become available over time rather than all
// being granted before every offline action is calculated.
export const advanceGame = (playerState, deltaMs, now = Date.now()) => {
    if (!Number.isFinite(deltaMs) || deltaMs <= 0) {
        return { ...playerState, lastUpdatedAt: now }
    }

    const player = structuredClone(playerState)
    const maxSliceMs = deltaMs > 1000 ? 1000 : deltaMs
    let remainingMs = deltaMs

    while (remainingMs > 0) {
        const sliceMs = Math.min(remainingMs, maxSliceMs)

        // Mana capacity and regeneration are derived from the current Spellcraft level.
        const maxMana = getManaCapacity(player)
        player.mana.max = maxMana
        player.mana.current = Math.min(
            maxMana,
            player.mana.current + getManaRegeneration(player) * (sliceMs / 1000)
        )

        advanceRunningActions(player, sliceMs)
        remainingMs -= sliceMs
    }

    player.lastUpdatedAt = now
    return player
}

// Pure helpers used by the reducer when a player starts/stops activities.
export const canStartAction = (player, skillId, actionId) => {
    const skill = SKILL_CONFIG_BY_ID[skillId]
    const action = skill?.actions.find(entry => entry.id === actionId)
    const state = player.skills[skillId]?.actions[actionId]

    if (!player.unlockedSkills?.includes(skillId) || !skill || !action || !state?.unlocked || state.level >= GLOBAL_CONFIG.maxActionLevel) {
        return false
    }

    // Require enough Mana to begin; completion checks and deducts it again.
    return canPayActionCost(player, skill, action)
}

export const getActionActivity = (skillId, actionId) => {
    const skill = SKILL_CONFIG_BY_ID[skillId]
    const action = skill?.actions.find(entry => entry.id === actionId)
    return action?.activity ?? skill?.activity ?? "active"
}
