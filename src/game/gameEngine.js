import {
    GLOBAL_CONFIG,
    SKILL_CONFIGS,
    SKILL_CONFIG_BY_ID,
    getActionXPTable,
    getSkillXPTable,
} from "../data/skillConfig"
import { ITEM_DATA, ITEM_DATA_BY_ID, SHOP_ITEM_DATA_BY_ID } from "../data/itemData"
import { SKILL_NAVIGATION } from "../data/navigationData"
import { humanize } from "../utility/helpers"
import { COMPANION_DATA, COMPANION_DATA_BY_ID, COMPANION_DATA_BY_CONTAINER_ID } from "../data/companionData"
import { COMPANION_CONFIG } from "../data/companionConfig"
import { COMBAT_CONFIG, COMBAT_ACTION_BY_AREA_ID } from "../data/combatConfig"
import { EXPLORATION_CONFIG } from "../data/explorationConfig"
import { SPELLCRAFT_CONFIG } from "../data/spellcraftConfig"
import { WORLD_AREA_BY_ID } from "../data/worldData"
import {
    RESEARCH_BREAKTHROUGH_CONFIG,
    formatResearchBreakthroughChance,
    getResearchBreakthroughItems,
} from "../data/researchBreakthroughConfig"



// The first ten additional slots rise from 1x to 10x the base cost.
// Later groups rise from 2x to 10x the next order of magnitude.
export const getNextBagSlotCost = (inventorySlots = GLOBAL_CONFIG.startingBagSpace) => {
    const purchasedSlots = Math.max(
        0,
        Math.floor(inventorySlots) - GLOBAL_CONFIG.startingBagSpace
    )
    const baseCost = GLOBAL_CONFIG.bagSlotStartingCost

    const cost = purchasedSlots < 10
        ? baseCost * (purchasedSlots + 1)
        : (() => {
            const slotsAfterFirstGroup = purchasedSlots - 10
            const costTier = Math.floor(slotsAfterFirstGroup / 9) + 1
            const costStep = (slotsAfterFirstGroup % 9) + 2
            return baseCost * costStep * Math.pow(10, costTier)
        })()

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

const isEligibleSelectedItem = (action, item, player = null) => {
    const selection = action.inputSelection
    if (!selection || !item) return false
    if (Number.isFinite(selection.minTier) && item.tier < selection.minTier) return false
    if (Number.isFinite(selection.maxTier) && item.tier > selection.maxTier) return false

    const matchesSelection = (selection.groups ?? []).includes(item.group) ||
        (selection.types ?? []).includes(item.type)
    if (!matchesSelection) return false

    if (Number.isFinite(item.requiredUnveilingLevel) && player) {
        const unveilingLevel = getSkillProgress(player, "skill:unveiling")?.level ?? 1
        if (unveilingLevel < item.requiredUnveilingLevel) return false
    }

    return true
}

export const getActionSelectableItems = (player, skillId, actionId) => {
    const action = SKILL_CONFIG_BY_ID[skillId]?.actions.find(entry => entry.id === actionId)
    if (!action?.inputSelection) return []

    return ITEM_DATA
        .filter(item => isEligibleSelectedItem(action, item, player) && (player.inventory?.[item.id] ?? 0) > 0)
        .map(item => ({ ...item, amount: player.inventory[item.id] }))
        .sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name))
}

export const canSelectActionItem = (player, skillId, actionId, itemId) => {
    const action = SKILL_CONFIG_BY_ID[skillId]?.actions.find(entry => entry.id === actionId)
    const item = ITEM_DATA_BY_ID[itemId]
    return Boolean(
        player.unlockedSkills?.includes(skillId) &&
        player.skills?.[skillId]?.actions?.[actionId]?.unlocked &&
        isEligibleSelectedItem(action, item, player) &&
        (player.inventory?.[itemId] ?? 0) > 0
    )
}

// Action inputs support the same string and { item, amount } formats as the
// resource display. Invalid requirements fail safely instead of being ignored.
const getActionConsumeTotals = (action, player = null, skill = null) => {
    if (action.companionTraining) {
        const combinedLevels = getActiveCompanionIds(player ?? {}).reduce(
            (total, companionId) => total + (player?.companionProgress?.[companionId]?.level ?? 0),
            0
        )
        const costPerLevel = action.companionTraining.coinsPerCombinedLevel ?? 10
        const milestoneReduction = player && skill
            ? getBonusForEffect(getActionMilestoneBonuses(player, skill, action), "baseGoldCost").flat
            : 0
        return { "currency:coins": Math.max(0, combinedLevels * Math.max(0, costPerLevel + milestoneReduction)) }
    }

    if (action.inputSelection) {
        const selectedItemId = player?.skills?.[skill?.id]?.actions?.[action.id]?.selectedItemId
        const selectedItem = ITEM_DATA_BY_ID[selectedItemId]
        return isEligibleSelectedItem(action, selectedItem, player)
            ? { [selectedItemId]: 1 }
            : null
    }

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

export const getActionConsumeResources = (player, skill, action) =>
    Object.entries(getActionConsumeTotals(action, player, skill) ?? {})
        .map(([item, amount]) => ({ item, amount }))


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
export const getItemActionSources = (itemId, player = null) => {
    const obtainedBy = []
    const consumedBy = []

    for (const skill of SKILL_CONFIGS) {
        if (Array.isArray(skill.unlockCosts)) {
            const skillCost = (player
                ? getSkillUnlockCosts(player, skill.id)
                : skill.unlockCosts
            ).filter(cost => cost.item === itemId)
                .reduce((total, cost) => total + (cost.amount ?? 0), 0)

            if (skillCost > 0 && (!player || !player.unlockedSkills?.includes(skill.id))) {
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

            if (skill.id === COMBAT_CONFIG.id) {
                const combatReward = (action.rewards ?? []).find(reward =>
                    (typeof reward === "string" ? reward : reward?.item) === itemId
                )
                if (combatReward) {
                    const rewardItem = typeof combatReward === "string" ? combatReward : combatReward.item
                    const rewardAmount = typeof combatReward === "string" ? 1 : combatReward.amount ?? 1
                    const artifactChance = ITEM_DATA_BY_ID[rewardItem]?.type === "artifact"
                        ? (player ? getCombatArtifactChance(player, action) : EXPLORATION_CONFIG.artifactChance?.base ?? 0)
                        : 1
                    if (artifactChance > 0) {
                        obtainedBy.push({
                            id: "combat-reward-" + action.id + "-" + rewardItem,
                            name: actionName + " Combat",
                            amount: rewardAmount,
                            amountLabel: ITEM_DATA_BY_ID[rewardItem]?.type === "artifact"
                                ? (artifactChance * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "% chance per victory"
                                : String(rewardAmount) + " per victory",
                            type: "action",
                            badgeVariant: "combat",
                        })
                    }
                }
            }

            if (outputAmount > 0) {
                obtainedBy.push({
                    id: "obtain-" + skill.id + "-" + action.id,
                    name: actionName,
                    amount: outputAmount,
                    type: "action",
                    badgeVariant: skill.variant
                })
            }

            if (
                action.processesCompanionContainers &&
                Object.values(skill.companionRewards?.experienceItemsByElement ?? {}).includes(itemId)
            ) {
                const candyAmounts = COMPANION_DATA
                    .filter(companion => skill.companionRewards?.experienceItemsByElement?.[companion.element] === itemId)
                    .map(companion => companion.duplicateCandyAmount ?? companion.tier ?? 1)
                const minimumAmount = Math.min(...candyAmounts)
                const maximumAmount = Math.max(...candyAmounts)
                obtainedBy.push({
                    id: "unveil-reward-" + skill.id + "-" + itemId,
                    name: actionName,
                    amount: minimumAmount,
                    amountLabel: minimumAmount === maximumAmount
                        ? String(minimumAmount) + " per duplicate"
                        : String(minimumAmount) + "–" + String(maximumAmount) + " per duplicate",
                    type: "action",
                    badgeVariant: skill.variant
                })
            }

            const companionContainerId = typeof action.companionContainer === "string"
                ? action.companionContainer
                : action.companionContainer?.item
            if (companionContainerId === itemId) {
                const companionChance = player
                    ? getActionCompanionChance(player, skill, action)
                    : (skill.companionChance?.base ?? 0)

                if (companionChance > 0) {
                    obtainedBy.push({
                        id: "obtain-companion-" + skill.id + "-" + action.id,
                        name: actionName,
                        amount: 1,
                        amountLabel: (companionChance * 100).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }) + "% chance",
                        type: "action",
                        badgeVariant: skill.variant
                    })
                }
            }

            const selection = action.inputSelection
            const selectedItemIsEligible = Boolean(
                selection && isEligibleSelectedItem(action, ITEM_DATA_BY_ID[itemId], player)
            )
            const consumedAmount = selection
                ? (selectedItemIsEligible ? 1 : 0)
                : (getActionConsumeTotals(action, player, skill)?.[itemId] ?? 0)
            if (consumedAmount > 0) {
                consumedBy.push({
                    id: "consume-" + skill.id + "-" + action.id,
                    name: actionName,
                    amount: consumedAmount,
                    type: "action",
                    badgeVariant: skill.variant
                })
            }

            const actionUnlockCosts = player
                ? getActionUnlockCosts(player, skill.id, action.id)
                : (action.unlockCosts ?? [])
            const unlockAmount = actionUnlockCosts
                .filter(cost => cost.item === itemId)
                .reduce((total, cost) => total + (cost.amount ?? 0), 0)

            if (unlockAmount > 0 && (!player || !player.skills?.[skill.id]?.actions?.[action.id]?.unlocked)) {
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

    const breakthroughItem = RESEARCH_BREAKTHROUGH_CONFIG.items.find(entry =>
        entry.itemId === itemId
    )
    const breakthroughTier = Math.max(0, Number(player?.researchBreakthroughTier) || 0)
    const researchSkill = SKILL_CONFIG_BY_ID[RESEARCH_BREAKTHROUGH_CONFIG.skillId]

    if (breakthroughItem && breakthroughTier >= breakthroughItem.tier) {
        for (const action of researchSkill?.actions ?? []) {
            if (action.tier < breakthroughItem.tier) continue

            obtainedBy.push({
                id: "research-breakthrough-" + action.id + "-" + breakthroughItem.tier,
                name: action.name ?? humanize(action.id),
                amount: 1,
                amountLabel: formatResearchBreakthroughChance(breakthroughItem.chance),
                type: "action",
                badgeVariant: researchSkill.variant,
            })
        }
    }

    return { obtainedBy, consumedBy }
}

// Each distinct item type occupies one slot; additional copies stack. Reserve
// every eligible random reward as a possible new type before the action finishes.
const canStoreActionOutputs = (player, skill, action) => {
    const inventory = player.inventory ?? {}
    const occupiedSlots = Object.entries(inventory)
        .filter(([itemId, amount]) => ITEM_DATA_BY_ID[itemId] && amount > 0)
        .length
    const outputMultiplier = getActionOutputMultiplier(player, skill, action)
    const possibleItemIds = outputMultiplier > 0
        ? getActionOutputs(action).map(output => output.item)
        : []

    if (skill.id === RESEARCH_BREAKTHROUGH_CONFIG.skillId) {
        possibleItemIds.push(...getResearchBreakthroughItems(
            player.researchBreakthroughTier,
            action.tier
        ).map(item => item.itemId))
    }

    const selectedItemId = player.skills?.[skill.id]?.actions?.[action.id]?.selectedItemId
    const selectedItem = ITEM_DATA_BY_ID[selectedItemId]

    if (action.processesCompanionContainers && selectedItem?.type === "companionContainer") {
        const companion = COMPANION_DATA_BY_CONTAINER_ID[selectedItem.id]
        if (!companion || !player.unlockedCompanions?.includes(companion.id)) return true

        const duplicateReward = skill.companionRewards?.experienceItemsByElement?.[selectedItem.variant]
        const duplicateRewardAmount = (companion.duplicateCandyAmount ?? companion.tier ?? 1) * outputMultiplier
        const inventorySlots = player.inventorySlots ?? GLOBAL_CONFIG.startingBagSpace
        const rewardItemsToAdd = duplicateReward && duplicateRewardAmount > 0 && !(inventory[duplicateReward] > 0)
            ? [duplicateReward]
            : []
        const containerSlotFreed = (inventory[selectedItem.id] ?? 0) === 1
        const availableSlots = inventorySlots - occupiedSlots + (containerSlotFreed ? 1 : 0)
        if (rewardItemsToAdd.length > 0 && availableSlots <= 0) return false
    }

    const companionContainerId = typeof action.companionContainer === "string"
        ? action.companionContainer
        : action.companionContainer?.item
    if (
        getActionCompanionChance(player, skill, action) > 0 &&
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

    const costs = getUnlockCostTotals(getSkillUnlockCosts(player, skillId))
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

    const costs = getUnlockCostTotals(getActionUnlockCosts(player, skillId, actionId))
    if (!costs) return false
    return Object.entries(costs).every(([itemId, amount]) =>
        getUnlockCostBalance(player, itemId) >= amount
    )
}

export const getSkillProgress = (player, skillId) => {
    const skill = SKILL_CONFIG_BY_ID[skillId]
    const table = getSkillXPTable(skillId)
    if (!skill || !table) return null

    // Companion Skill XP is the sum of all companion levels.
    const totalXP = skill.progression?.type === "companionLevels"
        ? COMPANION_DATA.reduce((total, companion) =>
            total + (player.companionProgress?.[companion.id]?.level ?? 0), 0)
        : skill.actions.reduce((total, action) => {
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

// Permanent companion effects apply globally; active-slot effects target one skill.
const getCompanionEffectMultiplier = (effect, level, perLevel) => {
    const startingBonus = effect === "preservation"
        ? 0
        : COMPANION_CONFIG.companionLeveling.effectStartingBonus ?? 0
    const growth = effect === "preservation"
        ? level * perLevel
        : startingBonus + Math.max(0, level - 1) * perLevel
    if (effect === "manaCost" || effect === "unlockCostReduction" || effect === "combatInterval") {
        return Math.max(0.1, 1 - growth)
    }
    return 1 + growth
}

export const getCompanionEffectEntry = (player, companion, effectKey) => {
    const effectConfig = companion?.[effectKey]
    if (!effectConfig) return null

    const level = player.companionProgress?.[companion.id]?.level ?? 1
    const effect = effectConfig.effect

    return {
        id: "companion-" + companion.id + "-" + effectKey,
        title: companion.name + " Level " + level,
        effect,
        type: effectConfig.type ?? "mult",
        value: getCompanionEffectMultiplier(
            effect,
            level,
            effectConfig.perLevel ?? (effectKey === "permanentEffect" ? 0.01 : 0.025)
        ),
        stacks: 1,
        mode: "companion",
        variant: "companions",
    }
}



const getCompanionEffectEntries = (player, targetSkillId, effect) => {
    const unlocked = new Set(player.unlockedCompanions ?? [])
    const active = new Set(Object.values(player.activeCompanionSlots ?? {}).filter(Boolean))
    const entries = []

    for (const companion of COMPANION_DATA) {
        if (!unlocked.has(companion.id)) continue
        const level = player.companionProgress?.[companion.id]?.level ?? 1
        if (level <= 0) continue

        const permanent = companion.permanentEffect
        if (permanent?.effect === effect) {
            entries.push({
                id: "companion-permanent-" + companion.id + "-" + effect,
                companion,
                level,
                kind: "Permanent",
                effect,
                type: permanent.type ?? "mult",
                value: getCompanionEffectMultiplier(effect, level, permanent.perLevel ?? 0.01),
            })
        }

        const activeEffect = companion.activeEffect
        if (
            active.has(companion.id) &&
            activeEffect?.effect === effect &&
            activeEffect.targetSkillId === targetSkillId
        ) {
            entries.push({
                id: "companion-active-" + companion.id + "-" + effect,
                companion,
                level,
                kind: "Active",
                effect,
                type: activeEffect.type ?? "mult",
                value: getCompanionEffectMultiplier(effect, level, activeEffect.perLevel ?? 0.025),
            })
        }
    }

    return entries
}

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

    const companionEffects = effect
        ? [effect]
        : [
            "sellValue",
            "xpGain",
            "actionTime",
            "itemOutput",
            "preservation",
            "manaCost",
            "manaCapacity",
            "manaRegeneration",
            "unlockCostReduction",
            "companionChance",
            "artifactChance",
            "baseGoldCost",
            "combatInterval",
            "combatDamage",
            "combatHealth",
            "combatShield",
        ]
    for (const companionEffect of companionEffects) {
        for (const companionEntry of getCompanionEffectEntries(player, targetSkillId, companionEffect)) {
            addMilestoneBonus(totals, companionEntry)
        }
    }

    return totals
}

export const getSkillUnlockCosts = (player, skillId) => {
    const skill = SKILL_CONFIG_BY_ID[skillId]
    const reduction = getBonusForEffect(getSkillMilestoneBonuses(player, skillId), "unlockCostReduction")
    const multiplier = Math.max(0.01, 1 + reduction.mult + reduction.flat)
    return (skill?.unlockCosts ?? []).map(cost => ({ ...cost, amount: Math.ceil(cost.amount * multiplier) }))
}

export const getActionUnlockCosts = (player, skillId, actionId) => {
    const action = SKILL_CONFIG_BY_ID[skillId]?.actions.find(entry => entry.id === actionId)
    const reduction = getBonusForEffect(getSkillMilestoneBonuses(player, skillId), "unlockCostReduction")
    const multiplier = Math.max(0.01, 1 + reduction.mult + reduction.flat)
    return (action?.unlockCosts ?? []).map(cost => ({ ...cost, amount: Math.ceil(cost.amount * multiplier) }))
}

export const getCompanionSlotUnlockCost = (player, element) => {
    const baseCost = COMPANION_CONFIG.slotDefinitions[element]?.unlockCost
    if (!Number.isFinite(baseCost) || baseCost <= 0) return 0
    const reduction = getBonusForEffect(getSkillMilestoneBonuses(player, "skill:companions"), "unlockCostReduction")
    return Math.ceil(baseCost * Math.max(0.01, 1 + reduction.mult + reduction.flat))
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

const getActionBaseDurationSeconds = (skill, action, player = null) => {
    const selectedItemId = player?.skills?.[skill.id]?.actions?.[action.id]?.selectedItemId
    const selectedItem = ITEM_DATA_BY_ID[selectedItemId]
    const durationConfig = action.time ?? skill.time
    const durationTier = action.durationBySelectedItemTier
        ? (selectedItem?.tier ?? action.tier)
        : action.tier
    return durationConfig.base + (durationConfig.perTier ?? 0) * (durationTier - 1)
}

export const getActionDurationMs = (skill, action, player = null) => {
    const baseSeconds = getActionBaseDurationSeconds(skill, action, player)
    const elementTimeMultiplier = skill.elementModifiers?.[action.element]?.timeMultiplier ?? 1
    const bonuses = player
        ? getBonusForEffect(getActionMilestoneBonuses(player, skill, action), "actionTime")
        : { flat: 0, mult: 0 }
    const actionSpeedMultiplier = Math.max(0.01, 1 + bonuses.mult + bonuses.flat)

    return Math.max(1, baseSeconds * elementTimeMultiplier / actionSpeedMultiplier * 1000)
}

const getActionBaseXPReward = (skill, action, player = null) => {
    const selectedItemId = player?.skills?.[skill.id]?.actions?.[action.id]?.selectedItemId
    const selectedItem = ITEM_DATA_BY_ID[selectedItemId]
    let baseXP = skill.actionXP.base + skill.actionXP.perTier * (action.tier - 1)

    if (action.xpFormula?.type === "itemBaseValuePower" && selectedItem) {
        const itemValue = Math.max(0, selectedItem.baseValue ?? 0)
        baseXP = Math.max(1, Math.round(Math.pow(itemValue, action.xpFormula.exponent ?? 0.7)))
    } else if (Number.isFinite(action.actionXPReward)) {
        baseXP = action.actionXPReward
    }

    return baseXP
}

export const getActionXPReward = (skill, action, player = null) => {
    const baseXP = getActionBaseXPReward(skill, action, player)
    const elementXPMultiplier = skill.elementModifiers?.[action.element]?.xpMultiplier ?? 1
    const bonuses = player
        ? getBonusForEffect(getActionMilestoneBonuses(player, skill, action), "xpGain")
        : { flat: 0, mult: 0 }
    const finalXP = baseXP * elementXPMultiplier * Math.max(0, 1 + bonuses.mult) + bonuses.flat

    return Math.max(0, finalXP)
}

// Action Mana uses the configured tier curve and element modifier, then applies
// any skill/action milestone discounts targeting this action's skill.
const getActionBaseManaCost = (skill, action) => {
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

    return baseCost
}

export const getActionManaCost = (skill, action, player = null) => {
    let baseCost = getActionBaseManaCost(skill, action)
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

export const getSellValueMultiplier = (player) => {
    const bonuses = getBonusForEffect(getSkillMilestoneBonuses(player, "skill:companions"), "sellValue")
    return Math.max(0, 1 + bonuses.mult + bonuses.flat)
}

export const getActionArtifactChance = (player, skill, action) => {
    const baseChance = skill.artifactChance?.base ?? 0
    const bonuses = getBonusForEffect(getActionMilestoneBonuses(player, skill, action), "artifactChance")
    if (!Number.isFinite(baseChance) || baseChance <= 0) return 0
    return Math.max(0, Math.min(1,
        baseChance * getActionOutputMultiplier(player, skill, action) * Math.max(0, 1 + bonuses.mult + bonuses.flat)
    ))
}

export const getActionCompanionChance = (player, skill, action) => {
    const companionContainerId = typeof action.companionContainer === "string"
        ? action.companionContainer
        : action.companionContainer?.item
    const baseChance = skill.companionChance?.base ?? 0

    if (
        !companionContainerId ||
        !ITEM_DATA_BY_ID[companionContainerId] ||
        !Number.isFinite(baseChance) ||
        baseChance <= 0
    ) return 0

    const bonuses = getBonusForEffect(getActionMilestoneBonuses(player, skill, action), "companionChance")
    const companionMultiplier = Math.max(0, 1 + bonuses.mult + bonuses.flat)
    return Math.max(0, Math.min(1,
        baseChance * getActionOutputMultiplier(player, skill, action) * companionMultiplier
    ))
}

export const getActionPreservationChance = (player, skill, action) => {
    const bonuses = getBonusForEffect(getActionMilestoneBonuses(player, skill, action), "preservation")
    return Math.max(0, Math.min(1, bonuses.mult + bonuses.flat))
}

// Build human-readable summaries from the same values used by the action engine.
export const getActionEffectSummary = (player, skill, action, effect) => {
    const ratio = (baseValue, finalValue) => baseValue > 0 ? finalValue / baseValue : 1

    if (effect === "actionTime") {
        const baseValue = getActionBaseDurationSeconds(skill, action, player)
        const finalValue = getActionDurationMs(skill, action, player) / 1000
        return {
            label: "Time",
            baseValue,
            combinedMultiplier: finalValue > 0 ? baseValue / finalValue : 1,
            finalValue,
            unit: "s",
            precision: 2,
        }
    }

    if (effect === "xpGain") {
        const baseValue = getActionBaseXPReward(skill, action, player)
        const finalValue = getActionXPReward(skill, action, player)
        return {
            label: "XP",
            baseValue,
            combinedMultiplier: ratio(baseValue, finalValue),
            finalValue,
            unit: "XP",
            precision: 2,
        }
    }

    if (effect === "manaCost") {
        const baseValue = getActionBaseManaCost(skill, action)
        const finalValue = getActionManaCost(skill, action, player)
        return {
            label: "Mana",
            baseValue,
            combinedMultiplier: ratio(baseValue, finalValue),
            finalValue,
            unit: "Mana",
            precision: 2,
        }
    }

    if (effect === "itemOutput") {
        const finalValue = getActionOutputMultiplier(player, skill, action)
        return {
            label: "Output",
            baseValue: 1,
            combinedMultiplier: finalValue,
            finalValue,
            valueFormat: "multiplier",
            unit: "",
            precision: 4,
            showCombined: false,
        }
    }

    if (effect === "preservation") {
        const finalValue = getActionPreservationChance(player, skill, action) * 100
        return {
            label: "Input Preservation",
            baseValue: 0,
            combinedMode: "bonusPercent",
            combinedValue: finalValue,
            finalValue,
            unit: "%",
            precision: 2,
            showCombined: false,
        }
    }

    if (effect === "baseGoldCost" && action.companionTraining) {
        const combinedLevels = getActiveCompanionIds(player).reduce(
            (total, companionId) => total + (player.companionProgress?.[companionId]?.level ?? 0),
            0
        )
        const baseCostPerLevel = Math.max(
            0,
            (action.companionTraining.coinsPerCombinedLevel ?? 10) +
                getBonusForEffect(getActionMilestoneBonuses(player, skill, action), "baseGoldCost").flat
        )
        const baseValue = combinedLevels * baseCostPerLevel
        const finalValue = getActionConsumeResources(player, skill, action)
            .find(resource => resource.item === "currency:coins")?.amount ?? 0
        return {
            label: "Gold Cost",
            baseValue,
            combinedMultiplier: ratio(baseValue, finalValue),
            finalValue,
            unit: "Coins",
            precision: 2,
        }
    }

    return null
}

// Return active contributors from element modifiers, applicable skill milestones
// and repeated action milestones. These records are used by the action tooltips.
export const getActionEffectStacks = (player, skill, action) => {
    const effectNames = ["actionTime", "xpGain", "manaCost", "itemOutput", "preservation", "manaCapacity", "manaRegeneration", "sellValue", "unlockCostReduction", "companionChance", "artifactChance", "baseGoldCost", "combatInterval", "combatDamage", "combatHealth", "combatShield"]
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
                source: (action.name ?? humanize(action.id)) + " Level " + actionLevel,
                effect,
                type: milestone.type,
                value: milestone.value,
                stacks,
                mode: "milestone",
                variant: skill.variant
            })
        }

        for (const companionEntry of getCompanionEffectEntries(player, skill.id, effect)) {
            entries.push({
                id: companionEntry.id,
                title: companionEntry.companion.name + " Level " + companionEntry.level,
                effect,
                type: companionEntry.type,
                value: companionEntry.value,
                stacks: 1,
                mode: "companion",
                variant: "companions",
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

export const getManaEffectSummary = (player, effect) => {
    const skill = SKILL_CONFIG_BY_ID["skill:spellcraft"]
    if (!skill?.mana || !["manaCapacity", "manaRegeneration"].includes(effect)) return null

    const capacity = effect === "manaCapacity"
    const baseValue = capacity ? skill.mana.base : skill.mana.regen
    const finalValue = capacity ? getManaCapacity(player) : getManaRegeneration(player)
    return {
        label: capacity ? "Mana Capacity" : "Mana Regeneration",
        baseValue,
        combinedMultiplier: baseValue > 0 ? finalValue / baseValue : 1,
        finalValue,
        unit: capacity ? "Mana" : "Mana / second",
        precision: 2,
    }
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

    for (const effect of effectNames) {
        for (const companionEntry of getCompanionEffectEntries(player, skill.id, effect)) {
            entriesByEffect[effect].push({
                id: companionEntry.id,
                title: companionEntry.companion.name + " Level " + companionEntry.level,
                effect,
                type: companionEntry.type,
                value: companionEntry.value,
                stacks: 1,
                mode: "companion",
                variant: "companions",
            })
        }
    }

    return entriesByEffect
}


export const getActionProgress = (actionState, durationMs) =>
    Math.min(100, Math.max(0, (actionState.progressMs / durationMs) * 100))

export const getActiveCompanionIds = (player) => Object.values(player.activeCompanionSlots ?? {})
    .filter(companionId => companionId && player.unlockedCompanions?.includes(companionId))

export const getTrainableActiveCompanionIds = (player) => getActiveCompanionIds(player)
    .filter(companionId => {
        const level = player.companionProgress?.[companionId]?.level
        return Number.isFinite(level) &&
            level >= 1 &&
            level < COMPANION_CONFIG.companionLeveling.maxLevel
    })

export const getCompanionLevelXPRequirement = (level, tier = 1) => {
    const config = COMPANION_CONFIG.companionLeveling.neededXP
    const tierMultiplier = config.tierMultiplier ?? 1.5
    const tierBase = config.base * Math.pow(tierMultiplier, Math.max(0, tier - 1))
    const levelOffset = Math.max(0, level - 1)

    return Math.ceil(
        tierBase * Math.pow(config.perLevelMult, levelOffset) +
        config.perLevelFlat * levelOffset
    )
}

export const getCompanionLevelProgress = (player, companionId) => {
    const companionState = player.companionProgress?.[companionId]
    if (!companionState || companionState.level <= 0) return null

    const level = companionState.level
    return {
        level,
        xp: companionState.xp,
        neededXP: level >= COMPANION_CONFIG.companionLeveling.maxLevel
            ? null
            : getCompanionLevelXPRequirement(level, COMPANION_DATA_BY_ID[companionId]?.tier ?? 1),
    }
}

const canPayActionCost = (player, skill, action) => {
    if (action.companionTraining && getTrainableActiveCompanionIds(player).length === 0) return false

    const manaCost = getActionManaCost(skill, action, player)
    const consumeTotals = getActionConsumeTotals(action, player, skill)
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

    const consumeTotals = getActionConsumeTotals(action, player, skill) ?? {}
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

export const getActionOutputDistribution = (amount, multiplier) => {
    const scaledAmount = Math.max(0, amount * multiplier)
    const wholeAmount = Math.floor(scaledAmount)
    return {
        wholeAmount,
        fractionalAmount: scaledAmount - wholeAmount,
    }
}

const rollActionOutputAmount = (amount, multiplier) => {
    const { wholeAmount, fractionalAmount } = getActionOutputDistribution(amount, multiplier)
    return wholeAmount + (fractionalAmount > 0 && Math.random() < fractionalAmount ? 1 : 0)
}

// Combat uses the same passive-action scheduler as other ongoing skills, but
// resolves individual attack events so each enemy retains its own timer.
const getCombatExplorationLevel = (player, action) => {
    const area = WORLD_AREA_BY_ID[action?.areaId]
    const explorationAction = area
        ? player.skills?.[EXPLORATION_CONFIG.id]?.actions?.[area.actionId]
        : null
    return Math.max(1, Math.floor(explorationAction?.level ?? 1))
}

export const getCombatOutputMultiplier = (player, action) =>
    1 + Math.max(0, getCombatExplorationLevel(player, action) - 1) *
        COMBAT_CONFIG.explorationLevelBonusPerLevel

const getCombatBonuses = (player, action) =>
    getActionMilestoneBonuses(player, COMBAT_CONFIG, action)

const getCombatEffectMultiplier = (bonuses, effect) => {
    const values = getBonusForEffect(bonuses, effect)
    return Math.max(0.1, 1 + values.mult + values.flat)
}

export const getCombatArtifactChance = (player, action) => {
    const baseChance = EXPLORATION_CONFIG.artifactChance?.base ?? 0
    if (!Number.isFinite(baseChance) || baseChance <= 0) return 0

    const bonuses = player ? getCombatBonuses(player, action) : {}
    const artifactMultiplier = player
        ? getCombatEffectMultiplier(bonuses, "artifactChance")
        : 1
    const chance = baseChance * getCombatOutputMultiplier(player ?? {}, action) * artifactMultiplier
    return Math.max(0, Math.min(1, chance))
}

export const getCombatXPReward = (player, action) =>
    getActionXPReward(COMBAT_CONFIG, action, player) * getCombatOutputMultiplier(player, action)

export const getCombatPlayerStats = (player, action) => {
    const bonuses = getCombatBonuses(player, action)
    const maxHealth = COMBAT_CONFIG.player.baseHealth *
        getCombatEffectMultiplier(bonuses, "combatHealth")
    const barrier = Math.min(
        maxHealth * 0.49,
        COMBAT_CONFIG.player.baseBarrier * getCombatEffectMultiplier(bonuses, "combatShield")
    )

    return {
        maxHealth,
        barrier,
        attackIntervalMs: Math.max(
            100,
            COMBAT_CONFIG.timing.playerAttackIntervalMs *
                getCombatEffectMultiplier(bonuses, "combatInterval")
        ),
        damageMultiplier: getCombatEffectMultiplier(bonuses, "combatDamage"),
    }
}

export const getCombatElementMultiplier = (attackElement, targetElement) => {
    if (!attackElement || attackElement === "neutral" ||
        !targetElement || targetElement === "neutral") {
        return COMBAT_CONFIG.elementalMatchups.neutralMultiplier
    }

    const { counters, advantageMultiplier, disadvantageMultiplier } =
        COMBAT_CONFIG.elementalMatchups
    if (counters[attackElement] === targetElement) return advantageMultiplier
    if (counters[targetElement] === attackElement) return disadvantageMultiplier
    return COMBAT_CONFIG.elementalMatchups.neutralMultiplier
}

const getCombatAttackDetails = (player, attackId) => {
    if (attackId === "omnibolt") {
        const spellcraftLevel = getSkillProgress(player, "skill:spellcraft")?.level ?? 1
        const tier = COMBAT_CONFIG.player.omniboltTier
        return {
            id: "omnibolt",
            name: "Omnibolt",
            element: "neutral",
            tier,
            level: spellcraftLevel,
            baseDamage: tier * 10 * (1 + 0.01 * spellcraftLevel),
        }
    }

    const action = SPELLCRAFT_CONFIG.actions.find(entry => entry.id === attackId)
    const actionState = player.skills?.[SPELLCRAFT_CONFIG.id]?.actions?.[attackId]
    if (!action || !actionState?.unlocked || !player.unlockedSkills?.includes(SPELLCRAFT_CONFIG.id)) {
        return getCombatAttackDetails(player, "omnibolt")
    }

    return {
        id: action.id,
        name: action.name ?? humanize(action.id.replace(/^action:/, "")),
        element: action.element ?? "neutral",
        tier: action.tier,
        level: actionState.level ?? 1,
        baseDamage: action.tier * 10 * (1 + 0.01 * (actionState.level ?? 1)),
    }
}

const createCombatEncounter = (player, action) => {
    const area = WORLD_AREA_BY_ID[action.areaId]
    const scaling = COMBAT_CONFIG.enemyScaling
    const areaOffset = Math.max(0, action.areaNumber - 1)
    const intervalBaseline = Math.max(
        scaling.minimumAttackIntervalMs,
        scaling.baseAttackIntervalMs - areaOffset * scaling.intervalReductionPerAreaMs
    )
    const enemies = (action.enemyLineup?.length ? action.enemyLineup : [{ archetype: "average" }])
        .map((lineupEntry, index) => {
            const archetypeId = COMBAT_CONFIG.enemyArchetypes[lineupEntry.archetype]
                ? lineupEntry.archetype
                : "average"
            const archetype = COMBAT_CONFIG.enemyArchetypes[archetypeId]
            const healthVariance = 1 + (Math.random() * 2 - 1) * scaling.variance
            const damageVariance = 1 + (Math.random() * 2 - 1) * scaling.variance
            const maxHealth = Math.max(
                1,
                scaling.baseHealth *
                    Math.pow(scaling.healthPerArea, areaOffset) *
                    archetype.healthMultiplier *
                    healthVariance
            )
            const attackIntervalMs = Math.max(
                scaling.minimumAttackIntervalMs,
                intervalBaseline * archetype.intervalMultiplier
            )

            return {
                id: action.id + "-enemy-" + index,
                archetype: archetypeId,
                name: (lineupEntry.name ?? archetype.label) + " " + (area?.name ?? action.name),
                element: area?.element ?? "neutral",
                maxHealth,
                health: maxHealth,
                damage: Math.max(
                    0,
                    scaling.baseDamage *
                        Math.pow(scaling.damagePerArea, areaOffset) *
                        archetype.damageMultiplier *
                        damageVariance
                ),
                attackIntervalMs,
                attackTimerMs: attackIntervalMs,
            }
        })
    const playerStats = getCombatPlayerStats(player, action)

    return {
        enemies,
        player: {
            health: playerStats.maxHealth,
            maxHealth: playerStats.maxHealth,
            barrier: playerStats.barrier,
            attackIntervalMs: playerStats.attackIntervalMs,
            attackTimerMs: playerStats.attackIntervalMs,
        },
        rotationIndex: 0,
    }
}

const getCombatInventorySlotCount = player => Object.entries(player.inventory ?? {})
    .filter(([itemId, amount]) => ITEM_DATA_BY_ID[itemId] && amount > 0)
    .length

const canStoreCombatItem = (player, itemId) => {
    if (!ITEM_DATA_BY_ID[itemId]) return false
    if ((player.inventory?.[itemId] ?? 0) > 0) return true
    const slots = player.inventorySlots ?? GLOBAL_CONFIG.startingBagSpace
    return getCombatInventorySlotCount(player) < slots
}

const grantCombatItem = (player, itemId, amount) => {
    if (!canStoreCombatItem(player, itemId)) return false
    player.inventory[itemId] = (player.inventory[itemId] ?? 0) + amount
    return true
}

const awardCombatActionXP = (player, action) => {
    const actionState = player.skills?.[COMBAT_CONFIG.id]?.actions?.[action.id]
    if (!actionState || actionState.level >= GLOBAL_CONFIG.maxActionLevel) return

    const xpReward = getCombatXPReward(player, action)
    actionState.xp += xpReward
    const xpTable = getActionXPTable(action.id)
    const neededXP = xpTable?.[actionState.level - 1]?.neededXP

    if (neededXP !== null && neededXP !== undefined && actionState.xp >= neededXP) {
        actionState.level += 1
        actionState.xp = 0
    }

    if (actionState.level >= GLOBAL_CONFIG.maxActionLevel) {
        actionState.level = GLOBAL_CONFIG.maxActionLevel
        actionState.xp = 0
    }
}

const finishCombatEncounter = (player, action) => {
    const combat = player.combat
    awardCombatActionXP(player, action)
    combat.encountersCompleted = (combat.encountersCompleted ?? 0) + 1

    const outputMultiplier = getCombatOutputMultiplier(player, action)
    const rewards = []
    const pending = []

    for (const reward of action.rewards ?? []) {
        const itemId = typeof reward === "string" ? reward : reward?.item
        const baseAmount = typeof reward === "string" ? 1 : reward?.amount ?? 1
        const itemData = ITEM_DATA_BY_ID[itemId]
        if (!itemData || !Number.isFinite(baseAmount) || baseAmount <= 0) continue

        let amount
        if (itemData.type === "artifact") {
            if (Math.random() >= getCombatArtifactChance(player, action)) continue
            amount = Math.max(1, Math.floor(baseAmount))
        } else {
            amount = rollActionOutputAmount(baseAmount, outputMultiplier)
        }
        if (amount <= 0) continue

        if (grantCombatItem(player, itemId, amount)) {
            rewards.push({ item: itemId, amount })
        } else {
            pending.push({ item: itemId, amount })
        }
    }

    combat.lastRewards = rewards
    combat.pendingRewards = pending
    if (pending.length > 0) {
        combat.phase = "inventoryFull"
        combat.cycleRemainingMs = 0
    } else {
        combat.phase = "rest"
        combat.cycleRemainingMs = COMBAT_CONFIG.timing.encounterDelayMs
    }
}

const resolvePendingCombatRewards = (player) => {
    const combat = player.combat
    const remaining = []

    for (const reward of combat.pendingRewards ?? []) {
        if (grantCombatItem(player, reward.item, reward.amount)) {
            combat.lastRewards = [...(combat.lastRewards ?? []), reward]
        } else {
            remaining.push(reward)
        }
    }

    combat.pendingRewards = remaining
    if (remaining.length === 0) {
        combat.phase = "rest"
        combat.cycleRemainingMs = COMBAT_CONFIG.timing.encounterDelayMs
    }
}

const getNextCombatAttack = (player, encounter) => {
    const rotation = player.combat?.rotation?.length
        ? player.combat.rotation
        : ["omnibolt"]
    const index = ((encounter.rotationIndex ?? 0) % rotation.length + rotation.length) % rotation.length
    return getCombatAttackDetails(player, rotation[index])
}

const advanceCombat = (player, deltaMs) => {
    const combat = player.combat
    if (!combat || !player.unlockedSkills?.includes(COMBAT_CONFIG.id)) return

    const action = COMBAT_ACTION_BY_AREA_ID[combat.selectedAreaId]
    const actionState = action
        ? player.skills?.[COMBAT_CONFIG.id]?.actions?.[action.id]
        : null
    if (!action || !actionState?.unlocked) return

    // A completed reward belongs to the previous encounter. Resolve it as soon
    // as Bag space becomes available, even if the player has paused Combat.
    if (combat.phase === "inventoryFull") {
        resolvePendingCombatRewards(player)
        if (combat.phase === "inventoryFull" || !actionState.running) return
    }
    if (!actionState.running) return

    let remainingMs = deltaMs
    let safetyCounter = 0

    while (remainingMs > 0.0001 && safetyCounter < 10000) {
        safetyCounter += 1

        if (combat.phase === "inventoryFull") {
            resolvePendingCombatRewards(player)
            if (combat.phase === "inventoryFull") break
            continue
        }

        if (combat.phase === "rest") {
            const delayRemaining = Math.max(0, combat.cycleRemainingMs ?? 0)
            const consumedMs = Math.min(remainingMs, delayRemaining)
            combat.cycleRemainingMs = delayRemaining - consumedMs
            remainingMs -= consumedMs
            if (combat.cycleRemainingMs <= 0.0001) {
                combat.cycleRemainingMs = 0
                combat.encounter = createCombatEncounter(player, action)
                combat.phase = "fighting"
            } else {
                break
            }
            continue
        }

        if (combat.phase !== "fighting" || !combat.encounter) {
            combat.encounter = createCombatEncounter(player, action)
            combat.phase = "fighting"
        }

        const encounter = combat.encounter
        const playerStats = getCombatPlayerStats(player, action)
        const combatant = encounter.player
        combatant.maxHealth = playerStats.maxHealth
        combatant.barrier = playerStats.barrier
        combatant.health = Math.min(
            combatant.maxHealth,
            Math.max(combatant.barrier, combatant.health)
        )
        combatant.attackIntervalMs = playerStats.attackIntervalMs
        combatant.attackTimerMs = Math.min(
            combatant.attackTimerMs,
            playerStats.attackIntervalMs
        )

        const livingEnemies = encounter.enemies.filter(enemy => enemy.health > 0)
        const nextEnemyTimer = livingEnemies.length > 0
            ? Math.min(...livingEnemies.map(enemy => Math.max(0, enemy.attackTimerMs)))
            : Infinity
        const nextEventMs = Math.min(
            Math.max(0, combatant.attackTimerMs),
            nextEnemyTimer
        )

        if (!Number.isFinite(nextEventMs)) {
            finishCombatEncounter(player, action)
            continue
        }

        const consumedMs = Math.min(remainingMs, nextEventMs)
        if (consumedMs > 0) {
            combatant.attackTimerMs = Math.max(0, combatant.attackTimerMs - consumedMs)
            for (const enemy of livingEnemies) {
                enemy.attackTimerMs = Math.max(0, enemy.attackTimerMs - consumedMs)
            }
            remainingMs -= consumedMs
        }

        // Each living enemy resolves its own attack as soon as its timer expires.
        for (const enemy of livingEnemies) {
            if (enemy.attackTimerMs <= 0.0001) {
                combatant.health = Math.max(
                    combatant.barrier,
                    combatant.health - enemy.damage
                )
                enemy.attackTimerMs = enemy.attackIntervalMs
            }
        }

        if (combatant.attackTimerMs <= 0.0001) {
            const target = encounter.enemies.find(enemy => enemy.health > 0)
            if (target) {
                const attack = getNextCombatAttack(player, encounter)
                const healthMultiplier = Math.min(
                    1,
                    combatant.health / (0.5 * combatant.maxHealth)
                )
                const damage = attack.baseDamage *
                    playerStats.damageMultiplier *
                    healthMultiplier *
                    getCombatElementMultiplier(attack.element, target.element)
                target.health = Math.max(0, target.health - damage)
            }

            const rotation = combat.rotation?.length ? combat.rotation : ["omnibolt"]
            encounter.rotationIndex = ((encounter.rotationIndex ?? 0) + 1) % rotation.length
            combatant.attackTimerMs = playerStats.attackIntervalMs

            if (!encounter.enemies.some(enemy => enemy.health > 0)) {
                finishCombatEncounter(player, action)
            }
        }

        if (consumedMs <= 0 && nextEventMs > 0) break
    }
}

const awardActionXP = (player, skill, action, actionState) => {
    const actionXP = getActionXPReward(skill, action, player)

    if (action.companionTraining) {
        for (const companionId of getTrainableActiveCompanionIds(player)) {
            const companionState = player.companionProgress?.[companionId]
            if (!companionState || companionState.level >= COMPANION_CONFIG.companionLeveling.maxLevel) continue

            companionState.xp += actionXP
            const neededXP = getCompanionLevelXPRequirement(companionState.level, COMPANION_DATA_BY_ID[companionId]?.tier ?? 1)
            if (companionState.xp >= neededXP) {
                companionState.level += 1
                companionState.xp = 0
            }
        }
    }

    if (action.tracksProgress === false) return

    const table = getActionXPTable(action.id)

    if (actionState.level < GLOBAL_CONFIG.maxActionLevel) {
        const neededXP = table[actionState.level - 1].neededXP
        actionState.xp += actionXP

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

    if (action.companionTraining) return

    const outputMultiplier = getActionOutputMultiplier(player, skill, action)
    const selectedItemId = action.inputSelection
        ? player.skills?.[skill.id]?.actions?.[action.id]?.selectedItemId
        : null
    const selectedItem = ITEM_DATA_BY_ID[selectedItemId]

    if (action.processesCompanionContainers && selectedItem?.type === "companionContainer") {
        const rewards = skill.companionRewards
        const companion = COMPANION_DATA_BY_CONTAINER_ID[selectedItem.id]
        const unlockedCompanions = player.unlockedCompanions ?? []

        if (companion && !unlockedCompanions.includes(companion.id)) {
            player.unlockedCompanions = [...unlockedCompanions, companion.id]
            player.companionProgress ??= {}
            player.companionProgress[companion.id] = { level: 1, xp: 0 }

            // The Companions skill and its training action unlock with the first pet.
            const companionSkillId = "skill:companions"
            const companionSkill = SKILL_CONFIG_BY_ID[companionSkillId]
            if (companionSkill && !player.unlockedSkills.includes(companionSkillId)) {
                player.unlockedSkills = [...player.unlockedSkills, companionSkillId]
                const currentSkill = player.skills[companionSkillId] ?? { actions: {} }
                const actions = { ...currentSkill.actions }
                for (const actionConfig of companionSkill.actions) {
                    if (!actionConfig.unlockedByDefault) continue
                    actions[actionConfig.id] = {
                        ...(actions[actionConfig.id] ?? {
                            level: 1, xp: 0, progressMs: 0, selectedItemId: null, running: false,
                        }),
                        unlocked: true,
                    }
                }
                player.skills[companionSkillId] = { ...currentSkill, actions }
            }
        } else if (companion) {
            const experienceItem = rewards?.experienceItemsByElement?.[selectedItem.variant]
            const rewardAmount = companion.duplicateCandyAmount ?? companion.tier ?? 1
            const outputAmount = rollActionOutputAmount(rewardAmount, outputMultiplier)
            if (experienceItem && ITEM_DATA_BY_ID[experienceItem] && outputAmount > 0) {
                player.inventory[experienceItem] =
                    (player.inventory[experienceItem] ?? 0) + outputAmount
            }
        }
    }

    for (const { item, amount } of getActionOutputs(action)) {
        const outputAmount = rollActionOutputAmount(amount, outputMultiplier)

        if (outputAmount <= 0) continue

        if (item.startsWith("currency:")) {
            const currencyId = item.slice("currency:".length)
            player.currencies[currencyId] = (player.currencies[currencyId] ?? 0) + outputAmount
        } else if (ITEM_DATA_BY_ID[item]) {
            player.inventory[item] = (player.inventory[item] ?? 0) + outputAmount
        }
    }

    // Research Breakthrough rewards use fixed base chances. They are rolled
    // independently of Action Output bonuses, once per eligible discovery item.
    if (skill.id === RESEARCH_BREAKTHROUGH_CONFIG.skillId) {
        for (const item of getResearchBreakthroughItems(
            player.researchBreakthroughTier,
            action.tier
        )) {
            if (Math.random() < item.chance) {
                player.inventory[item.itemId] = (player.inventory[item.itemId] ?? 0) + 1
            }
        }
    }

    // Some areas have a chance to reveal their matching elemental container.
    const companionContainerId = typeof action.companionContainer === "string"
        ? action.companionContainer
        : action.companionContainer?.item
    // Item-output bonuses also improve the chance to discover companion containers.
    const companionChance = getActionCompanionChance(player, skill, action)
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
    while (remainingMs > 0 && (!isActive || action.tracksProgress === false || actionState.level < GLOBAL_CONFIG.maxActionLevel)) {
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
                const reachedLevelCap =
                    action.tracksProgress !== false &&
                    actionState.level >= GLOBAL_CONFIG.maxActionLevel
                const canContinue = canPayActionCost(player, skill, action)

                if (reachedLevelCap || !canContinue) {
                    // Keep the chosen material while it is still available. Clear it
                    // only when the completed action consumed the final selected item.
                    if (!canContinue && action.inputSelection) {
                        const selectedItemId = actionState.selectedItemId
                        if (selectedItemId && (player.inventory?.[selectedItemId] ?? 0) <= 0) {
                            actionState.selectedItemId = null
                        }
                    }

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
            if (activity !== "passive" || skill.id === COMBAT_CONFIG.id) continue

            const actionState = player.skills[skill.id]?.actions[action.id]
            if (!actionState?.unlocked || !actionState.running) continue

            advanceOneAction(player, skill, action, actionState, deltaMs, false)
        }
    }

    advanceCombat(player, deltaMs)
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

    if (!player.unlockedSkills?.includes(skillId) || !skill || !action || !state?.unlocked) {
        return false
    }

    const activity = action.activity ?? skill.activity ?? "active"
    if (activity === "active" && action.tracksProgress !== false && state.level >= GLOBAL_CONFIG.maxActionLevel) {
        return false
    }

    if (skillId === COMBAT_CONFIG.id) {
        const combatAction = COMBAT_ACTION_BY_AREA_ID[action.areaId]
        const explorationActionId = WORLD_AREA_BY_ID[action.areaId]?.actionId
        if (
            !combatAction ||
            !explorationActionId ||
            !player.skills?.[EXPLORATION_CONFIG.id]?.actions?.[explorationActionId]?.unlocked
        ) return false
    }

    // Training requires at least one companion in an active slot.
    if (action.companionTraining && getActiveCompanionIds(player).length === 0) return false

    // Require enough inputs and Mana to begin; completion checks them again.
    return canPayActionCost(player, skill, action)
}

export const getActionActivity = (skillId, actionId) => {
    const skill = SKILL_CONFIG_BY_ID[skillId]
    const action = skill?.actions.find(entry => entry.id === actionId)
    return action?.activity ?? skill?.activity ?? "active"
}
