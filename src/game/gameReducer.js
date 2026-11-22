import { GLOBAL_CONFIG, SKILL_CONFIG_BY_ID } from "../data/skillConfig"
import { CURRENCY_DATA_BY_ID, ITEM_DATA_BY_ID, SHOP_ITEM_DATA_BY_ID } from "../data/itemData"
import { MISSION_DATA } from "../data/missionData"
import { COMPANION_CONFIG } from "../data/companionConfig"
import { COMPANION_DATA_BY_ID } from "../data/companionData"
import { SKILL_NAVIGATION } from "../data/navigationData"
import { RESEARCH_BREAKTHROUGH_CONFIG, getResearchBreakthroughCost } from "../data/researchBreakthroughConfig"
import {
    advanceGame,
    canStartAction,
    canBuyShopItem,
    canUnlockAction,
    canSelectActionItem,
    canUnlockSkill,
    getActionActivity,
    getNextBagSlotCost,
    getActionUnlockCosts,
    getSkillUnlockCosts,
    getSellValueMultiplier,
    getCompanionSlotUnlockCost,
} from "./gameEngine"

export const gameReducer = (state, action) => {
    switch (action.type) {
        case "START_ACTION": {
            const { skillId, actionId } = action
            if (!canStartAction(state, skillId, actionId)) return state

            const activity = getActionActivity(skillId, actionId)

            if (activity === "passive") {
                const current = state.skills[skillId].actions[actionId]
                if (current.running) return state

                return {
                    ...state,
                    skills: {
                        ...state.skills,
                        [skillId]: {
                            ...state.skills[skillId],
                            actions: {
                                ...state.skills[skillId].actions,
                                [actionId]: { ...current, running: true },
                            },
                        },
                    },
                }
            }

            if (
                state.activeAction?.skillId === skillId &&
                state.activeAction?.actionId === actionId
            ) {
                return state
            }

            // Replacing an active action is also a stop: discard its partial cycle.
            let skills = state.skills
            if (state.activeAction) {
                const previous = state.activeAction
                const previousState = state.skills[previous.skillId]?.actions[previous.actionId]

                if (previousState) {
                    skills = {
                        ...state.skills,
                        [previous.skillId]: {
                            ...state.skills[previous.skillId],
                            actions: {
                                ...state.skills[previous.skillId].actions,
                                [previous.actionId]: {
                                    ...previousState,
                                    progressMs: 0,
                                },
                            },
                        },
                    }
                }
            }

            return {
                ...state,
                skills,
                activeAction: { skillId, actionId },
            }
        }

        case "STOP_ACTION": {
            const { skillId, actionId } = action
            const activity = getActionActivity(skillId, actionId)
            const current = state.skills[skillId]?.actions[actionId]
            if (!current) return state

            // Passive work cannot be stopped. Future target changes must
            // update the target separately without toggling the process off.
            if (activity === "passive") return state

            if (state.activeAction?.skillId !== skillId || state.activeAction?.actionId !== actionId) {
                return state
            }

            return {
                ...state,
                activeAction: null,
                skills: {
                    ...state.skills,
                    [skillId]: {
                        ...state.skills[skillId],
                        actions: {
                            ...state.skills[skillId].actions,
                            [actionId]: {
                                ...current,
                                progressMs: 0,
                            },
                        },
                    },
                },
            }
        }

        case "TOGGLE_PASSIVE_ACTION": {
            const { skillId, actionId, running } = action
            if (getActionActivity(skillId, actionId) !== "passive") return state
            if (!running || !canStartAction(state, skillId, actionId)) return state

            const current = state.skills[skillId]?.actions[actionId]
            if (!current || current.running) return state

            return {
                ...state,
                skills: {
                    ...state.skills,
                    [skillId]: {
                        ...state.skills[skillId],
                        actions: {
                            ...state.skills[skillId].actions,
                            [actionId]: { ...current, running: true },
                        },
                    },
                },
            }
        }

        case "UNLOCK_COMPANION_SLOT": {
            if (!state.unlockedSkills?.includes("skill:companions")) return state
            const { slotId } = action
            const slot = COMPANION_CONFIG.slots[slotId]
            const unlockedSlots = state.unlockedCompanionSlots ?? ["any"]
            const cost = getCompanionSlotUnlockCost(state, slotId)

            if (
                !slot ||
                unlockedSlots.includes(slotId) ||
                !Number.isFinite(cost) ||
                cost <= 0 ||
                (state.currencies?.coins ?? 0) < cost
            ) return state

            return {
                ...state,
                unlockedCompanionSlots: [...unlockedSlots, slotId],
                currencies: {
                    ...state.currencies,
                    coins: (state.currencies?.coins ?? 0) - cost,
                },
            }
        }

        case "SELECT_COMPANION": {
            if (!state.unlockedSkills?.includes("skill:companions")) return state
            const { slotId, companionId } = action
            const unlockedSlots = state.unlockedCompanionSlots ?? ["any"]
            const slot = COMPANION_CONFIG.slots[slotId]
            const companion = COMPANION_DATA_BY_ID[companionId]
            const currentSlots = state.activeCompanionSlots ?? {
                any: null, earth: null, air: null, water: null,
            }
            if (!slot || !unlockedSlots.includes(slotId)) return state
            if (companionId !== null && (
                !companion ||
                (slot.element !== null && companion.element !== "neutral" && companion.element !== slot.element) ||
                !state.unlockedCompanions?.includes(companionId) ||
                Object.entries(currentSlots).some(([otherSlotId, assignedId]) =>
                    otherSlotId !== slotId && assignedId === companionId
                )
            )) return state

            const activeCompanionSlots = {
                ...currentSlots,
                [slotId]: companionId,
            }
            const noActiveCompanions = !Object.values(activeCompanionSlots).some(Boolean)
            const stopTraining = noActiveCompanions &&
                state.activeAction?.skillId === "skill:companions"

            let skills = state.skills
            if (stopTraining) {
                const trainingActionId = COMPANION_CONFIG.actions[0].id
                const currentSkill = state.skills["skill:companions"]
                const currentAction = currentSkill?.actions?.[trainingActionId]
                if (currentAction) {
                    skills = {
                        ...state.skills,
                        "skill:companions": {
                            ...currentSkill,
                            actions: {
                                ...currentSkill.actions,
                                [trainingActionId]: { ...currentAction, progressMs: 0 },
                            },
                        },
                    }
                }
            }

            return {
                ...state,
                activeAction: stopTraining ? null : state.activeAction,
                skills,
                activeCompanionSlots,
            }
        }

        case "SELECT_ACTION_ITEM": {
            const { skillId, actionId, itemId } = action
            if (!canSelectActionItem(state, skillId, actionId, itemId)) return state

            const currentSkill = state.skills[skillId]
            const currentAction = currentSkill.actions[actionId]
            const isActive = state.activeAction?.skillId === skillId &&
                state.activeAction?.actionId === actionId

            return {
                ...state,
                activeAction: isActive ? null : state.activeAction,
                skills: {
                    ...state.skills,
                    [skillId]: {
                        ...currentSkill,
                        actions: {
                            ...currentSkill.actions,
                            [actionId]: {
                                ...currentAction,
                                selectedItemId: itemId,
                                progressMs: 0,
                            },
                        },
                    },
                },
            }
        }

        case "UNLOCK_ACTION": {
            if (!state.unlockedSkills.includes(action.skillId)) return state

            const skill = SKILL_CONFIG_BY_ID[action.skillId]
            const actionConfig = skill?.actions.find(entry => entry.id === action.actionId)
            if (!actionConfig || !canUnlockAction(state, action.skillId, action.actionId)) return state

            // Keep unlocks compatible with an older in-memory player state that
            // predates an action added to the current skill/world configuration.
            const current = state.skills?.[action.skillId]?.actions?.[action.actionId] ?? {
                unlocked: Boolean(actionConfig.unlockedByDefault),
                level: 1,
                xp: 0,
                progressMs: 0,
                running: false,
            }
            const currentSkill = state.skills?.[action.skillId] ?? { actions: {} }

            const inventory = { ...state.inventory }
            const currencies = { ...state.currencies }
            for (const { item, amount } of getActionUnlockCosts(state, action.skillId, action.actionId)) {
                if (item.startsWith("currency:")) {
                    const currencyId = item.slice("currency:".length)
                    currencies[currencyId] = (currencies[currencyId] ?? 0) - amount
                } else {
                    inventory[item] = (inventory[item] ?? 0) - amount
                }
            }

            return {
                ...state,
                inventory,
                currencies,
                skills: {
                    ...state.skills,
                    [action.skillId]: {
                        ...currentSkill,
                        actions: {
                            ...currentSkill.actions,
                            [action.actionId]: { ...current, unlocked: true },
                        },
                    },
                },
            }
        }

        case "BUY_BAG_SLOT": {
            const inventorySlots = state.inventorySlots ?? GLOBAL_CONFIG.startingBagSpace
            const cost = getNextBagSlotCost(inventorySlots)
            const coins = state.currencies?.coins ?? 0
            if (!Number.isFinite(cost) || coins < cost) return state

            return {
                ...state,
                inventorySlots: inventorySlots + 1,
                currencies: {
                    ...state.currencies,
                    coins: coins - cost,
                },
            }
        }

        case "BUY_RESEARCH_BREAKTHROUGH": {
            const currentTier = Math.max(
                0,
                Math.min(
                    RESEARCH_BREAKTHROUGH_CONFIG.maxTier,
                    Math.floor(Number(state.researchBreakthroughTier) || 0)
                )
            )
            const cost = getResearchBreakthroughCost(currentTier)
            const coins = state.currencies?.coins ?? 0
            if (currentTier >= RESEARCH_BREAKTHROUGH_CONFIG.maxTier || coins < cost) return state

            return {
                ...state,
                researchBreakthroughTier: currentTier + 1,
                currencies: {
                    ...state.currencies,
                    coins: coins - cost,
                },
            }
        }

        case "BUY_SHOP_ITEM": {
            const { itemId } = action
            const item = SHOP_ITEM_DATA_BY_ID[itemId]
            if (!item || !canBuyShopItem(state, itemId)) return state

            return {
                ...state,
                inventory: {
                    ...state.inventory,
                    [itemId]: (state.inventory?.[itemId] ?? 0) + 1,
                },
                currencies: {
                    ...state.currencies,
                    coins: (state.currencies?.coins ?? 0) - item.shopPrice,
                },
            }
        }

        case "SELL_ITEM": {
            const { itemId, amount } = action
            const availableAmount = state.inventory?.[itemId] ?? 0
            const itemData = ITEM_DATA_BY_ID[itemId]

            if (
                !itemData ||
                !Number.isSafeInteger(amount) ||
                amount < 1 ||
                amount > availableAmount ||
                !Number.isFinite(itemData.baseValue) ||
                itemData.baseValue < 0
            ) return state

            const inventory = { ...state.inventory }
            const remainingAmount = availableAmount - amount
            if (remainingAmount > 0) inventory[itemId] = remainingAmount
            else delete inventory[itemId]

            const saleValue = amount * itemData.baseValue * getSellValueMultiplier(state)

            return {
                ...state,
                inventory,
                currencies: {
                    ...state.currencies,
                    coins: (state.currencies?.coins ?? 0) + saleValue,
                },
            }
        }

        case "TURN_IN_MISSION": {
            const mission = MISSION_DATA.missions.find(entry => entry.id === action.missionId)
            const missionTier = Math.max(
                MISSION_DATA.startingTier,
                Math.floor(state.missionTier ?? MISSION_DATA.startingTier)
            )
            const completedMissions = new Set(state.completedMissions ?? [])
            const objective = mission?.objective
            const requirements = objective?.items ?? [{
                item: objective?.item,
                amount: objective?.amount,
            }]
            const requirementTotals = {}
            const validRequirements = Array.isArray(requirements) &&
                requirements.length > 0 &&
                requirements.every(requirement => {
                    const valid = Boolean(ITEM_DATA_BY_ID[requirement.item]) &&
                        Number.isSafeInteger(requirement.amount) &&
                        requirement.amount > 0
                    if (valid) {
                        requirementTotals[requirement.item] =
                            (requirementTotals[requirement.item] ?? 0) + requirement.amount
                    }
                    return valid
                })
            const canAffordRequirements = validRequirements &&
                Object.entries(requirementTotals).every(([itemId, amount]) =>
                    Number.isSafeInteger(amount) && (state.inventory?.[itemId] ?? 0) >= amount
                )

            if (
                !mission ||
                mission.tier > missionTier ||
                completedMissions.has(mission.id) ||
                objective?.type !== "turnIn" ||
                !canAffordRequirements ||
                !Array.isArray(mission.rewards) ||
                !mission.rewards.every(reward => {
                    const validAmount = Number.isSafeInteger(reward.amount) && reward.amount > 0
                    const hasCurrency = typeof reward.currency === "string" &&
                        Boolean(CURRENCY_DATA_BY_ID[reward.currency]) &&
                        !reward.item
                    const hasItem = typeof reward.item === "string" &&
                        Boolean(ITEM_DATA_BY_ID[reward.item]) &&
                        !reward.currency
                    return validAmount && (hasCurrency || hasItem)
                })
            ) return state

            const inventory = { ...state.inventory }
            for (const [itemId, amount] of Object.entries(requirementTotals)) {
                const remainingAmount = (inventory[itemId] ?? 0) - amount
                if (remainingAmount > 0) inventory[itemId] = remainingAmount
                else delete inventory[itemId]
            }

            const itemRewardIds = [...new Set(
                mission.rewards.filter(reward => reward.item).map(reward => reward.item)
            )]
            const occupiedSlots = Object.entries(inventory)
                .filter(([itemId, amount]) => ITEM_DATA_BY_ID[itemId] && amount > 0)
                .length
            const inventorySlots = state.inventorySlots ?? GLOBAL_CONFIG.startingBagSpace
            const newItemSlots = itemRewardIds.filter(itemId => !(inventory[itemId] > 0)).length
            if (occupiedSlots + newItemSlots > inventorySlots) return state

            const currencies = { ...state.currencies }
            for (const reward of mission.rewards) {
                if (reward.currency) {
                    const currencyId = reward.currency.slice("currency:".length)
                    currencies[currencyId] = (currencies[currencyId] ?? 0) + reward.amount
                } else {
                    inventory[reward.item] = (inventory[reward.item] ?? 0) + reward.amount
                }
            }

            const nextCompletedMissions = [...completedMissions, mission.id]
            let nextMissionTier = missionTier

            while (nextMissionTier <= MISSION_DATA.tierRequirements.length) {
                const requiredCount = MISSION_DATA.tierRequirements[nextMissionTier - 1]
                if (!Number.isSafeInteger(requiredCount) || requiredCount < 1) break

                const completedCount = MISSION_DATA.missions.filter(entry =>
                    entry.tier === nextMissionTier && nextCompletedMissions.includes(entry.id)
                ).length

                if (completedCount < requiredCount) break
                nextMissionTier += 1
            }

            return {
                ...state,
                inventory,
                currencies,
                completedMissions: nextCompletedMissions,
                missionTier: nextMissionTier,
            }
        }

        case "UNLOCK_SKILL": {
            const skillExists = SKILL_NAVIGATION.some(skill => skill.skillId === action.skillId)
            const skillConfig = SKILL_CONFIG_BY_ID[action.skillId]
            if (
                !skillExists ||
                !skillConfig ||
                !canUnlockSkill(state, action.skillId)
            ) return state

            const inventory = { ...state.inventory }
            const currencies = { ...state.currencies }

            for (const { item, amount } of getSkillUnlockCosts(state, action.skillId)) {
                if (item.startsWith("currency:")) {
                    const currencyId = item.slice("currency:".length)
                    currencies[currencyId] = (currencies[currencyId] ?? 0) - amount
                } else {
                    inventory[item] = (inventory[item] ?? 0) - amount
                }
            }

            const currentSkill = state.skills[action.skillId]
            const actions = { ...currentSkill.actions }

            for (const actionConfig of skillConfig.actions) {
                if (!actionConfig.unlockedByDefault) continue
                const currentAction = actions[actionConfig.id]
                if (currentAction) {
                    actions[actionConfig.id] = { ...currentAction, unlocked: true }
                }
            }

            return {
                ...state,
                inventory,
                currencies,
                unlockedSkills: [...state.unlockedSkills, action.skillId],
                skills: {
                    ...state.skills,
                    [action.skillId]: {
                        ...currentSkill,
                        actions,
                    },
                },
            }
        }

        case "RESET_GAME":
            return action.player ?? state

        case "HYDRATE_PLAYER":
            return action.player ?? state

        case "TICK":
            return advanceGame(state, action.deltaMs, action.now)

        case "OFFLINE_PROGRESS":
            return advanceGame(state, action.deltaMs, action.now)

        default:
            return state
    }
}
