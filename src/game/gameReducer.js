import { SKILL_CONFIG_BY_ID } from "../data/skillConfig"
import { SKILL_NAVIGATION } from "../data/navigationData"
import {
    advanceGame,
    canStartAction,
    canUnlockAction,
    getActionActivity,
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

        case "UNLOCK_SKILL": {
            const skillExists = SKILL_NAVIGATION.some(skill => skill.skillId === action.skillId)
            if (!skillExists || state.unlockedSkills.includes(action.skillId)) return state

            return {
                ...state,
                unlockedSkills: [...state.unlockedSkills, action.skillId],
            }
        }

        case "TICK":
            return advanceGame(state, action.deltaMs, action.now)

        case "OFFLINE_PROGRESS":
            return advanceGame(state, action.deltaMs, action.now)

        default:
            return state
    }
}
