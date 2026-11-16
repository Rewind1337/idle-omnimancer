import { SKILL_CONFIG_BY_ID } from "../data/skillConfig"
import {
    advanceGame,
    canStartAction,
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

            // Starting a different active action replaces the previous one.
            // The previous action's partial progress remains saved on its state.
            return { ...state, activeAction: { skillId, actionId } }
        }

        case "STOP_ACTION": {
            const { skillId, actionId } = action
            const activity = getActionActivity(skillId, actionId)

            if (activity === "passive") {
                const current = state.skills[skillId]?.actions[actionId]
                if (!current) return state

                return {
                    ...state,
                    skills: {
                        ...state.skills,
                        [skillId]: {
                            ...state.skills[skillId],
                            actions: {
                                ...state.skills[skillId].actions,
                                // Keep cycleStarted: its cost has already been
                                // paid, so resuming must not charge it twice.
                                [actionId]: { ...current, running: false },
                            },
                        },
                    },
                }
            }

            if (state.activeAction?.skillId !== skillId || state.activeAction?.actionId !== actionId) {
                return state
            }

            return { ...state, activeAction: null }
        }

        case "TOGGLE_PASSIVE_ACTION": {
            const { skillId, actionId, running } = action
            if (getActionActivity(skillId, actionId) !== "passive") return state
            if (running && !canStartAction(state, skillId, actionId)) return state

            const current = state.skills[skillId]?.actions[actionId]
            if (!current) return state

            return {
                ...state,
                skills: {
                    ...state.skills,
                    [skillId]: {
                        ...state.skills[skillId],
                        actions: {
                            ...state.skills[skillId].actions,
                            [actionId]: { ...current, running },
                        },
                    },
                },
            }
        }

        case "UNLOCK_ACTION": {
            const skill = SKILL_CONFIG_BY_ID[action.skillId]
            const actionConfig = skill?.actions.find(entry => entry.id === action.actionId)
            const current = state.skills[action.skillId]?.actions[action.actionId]
            if (!actionConfig || !current || current.unlocked) return state

            return {
                ...state,
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

        case "TICK":
            return advanceGame(state, action.deltaMs, action.now)

        case "OFFLINE_PROGRESS":
            return advanceGame(state, action.deltaMs, action.now)

        default:
            return state
    }
}
