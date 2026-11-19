import { GLOBAL_CONFIG, SKILL_CONFIG_BY_ID } from "../data/skillConfig"
import { ITEM_DATA_BY_ID, SHOP_ITEM_DATA_BY_ID } from "../data/itemData"
import { SKILL_NAVIGATION } from "../data/navigationData"
import {
    advanceGame,
    canStartAction,
    canBuyShopItem,
    canUnlockAction,
    canUnlockSkill,
    getActionActivity,
    getNextBagSlotCost,
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

        case "UNLOCK_ACTION": {
            if (!state.unlockedSkills.includes(action.skillId)) return state

            const skill = SKILL_CONFIG_BY_ID[action.skillId]
            const actionConfig = skill?.actions.find(entry => entry.id === action.actionId)
            const current = state.skills[action.skillId]?.actions[action.actionId]
            if (!actionConfig || !current || !canUnlockAction(state, action.skillId, action.actionId)) return state

            const inventory = { ...state.inventory }
            const currencies = { ...state.currencies }
            for (const { item, amount } of actionConfig.unlockCosts ?? []) {
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
                        ...state.skills[action.skillId],
                        actions: {
                            ...state.skills[action.skillId].actions,
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

            const saleValue = amount * itemData.baseValue

            return {
                ...state,
                inventory,
                currencies: {
                    ...state.currencies,
                    coins: (state.currencies?.coins ?? 0) + saleValue,
                },
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

            for (const { item, amount } of skillConfig.unlockCosts) {
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
