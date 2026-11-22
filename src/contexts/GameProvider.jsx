import {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from "react"

import { GameContext } from "./GameContext"
import { createGameProgressStore } from "./GameProgressStore"
import { gameReducer } from "../game/gameReducer"
import { advanceGame, canStartAction, getSkillProgress } from "../game/gameEngine"
import {
    loadPlayerState,
    savePlayerState,
} from "../game/playerState"
import { ITEM_DATA_BY_ID, CURRENCY_DATA_BY_ID } from "../data/itemData"
import { SKILL_CONFIGS } from "../data/skillConfig"
import { SKILL_NAVIGATION } from "../data/navigationData"
import { humanize } from "../utility/helpers"
import { useToast } from "../hooks/useToast"
import { OfflineProgressModal } from "../components/modals/OfflineProgressModal"

const TICK_INTERVAL_MS = 100
const SAVE_INTERVAL_MS = 1000
const OFFLINE_CHUNK_DELAY_MS = 20
const FIRST_OFFLINE_CHUNK_DELAY_MS = 100
const MAX_OFFLINE_CHUNK_MS = 6 * 60 * 60 * 1000
const MAX_OFFLINE_CHUNKS = 300

const formatGainAmount = amount => Number(amount).toLocaleString()
const areSameArray = (first = [], second = []) =>
    first.length === second.length && first.every((value, index) => value === second[index])

const areSameRecord = (first = {}, second = {}) => {
    const firstKeys = Object.keys(first)
    const secondKeys = Object.keys(second)
    return firstKeys.length === secondKeys.length &&
        firstKeys.every(key => Object.is(first[key], second[key]))
}

const areSameCompanionProgress = (first = {}, second = {}) => {
    const firstIds = Object.keys(first)
    const secondIds = Object.keys(second)
    return firstIds.length === secondIds.length &&
        firstIds.every(id =>
            first[id]?.level === second[id]?.level &&
            first[id]?.xp === second[id]?.xp
        )
}

// Ignore fields that change continuously (Mana.current and action progressMs).
// Everything else here affects a rendered page, navigation badge, modal, or action.
const hasVisiblePlayerChanges = (previous, next) => {
    if (
        !areSameArray(previous.unlockedSkills, next.unlockedSkills) ||
        !areSameArray(previous.unlockedCompanions, next.unlockedCompanions) ||
        !areSameArray(previous.unlockedCompanionSlots, next.unlockedCompanionSlots) ||
        !areSameArray(previous.completedMissions, next.completedMissions) ||
        !areSameRecord(previous.inventory, next.inventory) ||
        !areSameRecord(previous.currencies, next.currencies) ||
        !areSameRecord(previous.activeCompanionSlots, next.activeCompanionSlots) ||
        !areSameCompanionProgress(previous.companionProgress, next.companionProgress) ||
        previous.inventorySlots !== next.inventorySlots ||
        previous.missionTier !== next.missionTier ||
        previous.mana?.max !== next.mana?.max ||
        previous.activeAction?.skillId !== next.activeAction?.skillId ||
        previous.activeAction?.actionId !== next.activeAction?.actionId
    ) return true

    const skillIds = new Set([
        ...Object.keys(previous.skills ?? {}),
        ...Object.keys(next.skills ?? {}),
    ])
    const actionFields = ["unlocked", "level", "xp", "selectedItemId", "running"]

    for (const skillId of skillIds) {
        const previousActions = previous.skills?.[skillId]?.actions ?? {}
        const nextActions = next.skills?.[skillId]?.actions ?? {}
        const actionIds = new Set([
            ...Object.keys(previousActions),
            ...Object.keys(nextActions),
        ])

        for (const actionId of actionIds) {
            const previousAction = previousActions[actionId]
            const nextAction = nextActions[actionId]
            if (!previousAction || !nextAction) return true

            if (actionFields.some(field =>
                !Object.is(previousAction[field], nextAction[field])
            )) return true
        }
    }

    return false
}

const updateActionReadiness = (progressStore, player, manaOnly = false) => {
    for (const skill of SKILL_CONFIGS) {
        if (!player.unlockedSkills?.includes(skill.id)) continue

        const skillHasManaCost = Boolean(skill.mana?.cost)
        for (const action of skill.actions) {
            if (!player.skills?.[skill.id]?.actions?.[action.id]?.unlocked) continue
            if (manaOnly && !skillHasManaCost && !(Number(action.manaCost) > 0)) continue

            progressStore.setActionCanStart(
                skill.id,
                action.id,
                canStartAction(player, skill.id, action.id)
            )
        }
    }
}

const formatMilestoneNumber = value => Number(value.toFixed(2)).toString()

const getSkillName = skillId =>
    SKILL_NAVIGATION.find(entry => entry.skillId === skillId)?.name ??
    humanize(skillId.replace(/^skill:/, ""))

const getMilestoneEffectDescription = (skill, milestone) => {
    const effectLabels = {
        actionTime: "Action Speed",
        xpGain: "Action XP",
        manaCost: "Mana Cost",
        itemOutput: "Item Output",
        preservation: "Preservation Chance",
        manaCapacity: "Mana Capacity",
        manaRegeneration: "Mana Regeneration",
    }
    const target = milestone.reach === "global"
        ? "All Skills"
        : milestone.reach === "local"
            ? getSkillName(skill.id)
            : getSkillName(milestone.reach)
    const amount = milestone.type === "mult"
        ? formatMilestoneNumber((milestone.value - 1) * 100) + "%"
        : "+" + formatMilestoneNumber(milestone.value)

    return amount + " " + (effectLabels[milestone.effect] ?? humanize(milestone.effect)) + " for " + target + "."
}

const getOfflineGains = (previous, next) => {
    const gains = []

    for (const [itemId, amount] of Object.entries(next.inventory ?? {})) {
        const gained = amount - (previous.inventory?.[itemId] ?? 0)
        if (gained <= 0) continue

        const item = ITEM_DATA_BY_ID[itemId]
        gains.push({
            key: itemId,
            text: "+" + formatGainAmount(gained) + " " + (item?.name ?? itemId),
        })
    }

    for (const [currencyId, amount] of Object.entries(next.currencies ?? {})) {
        const gained = amount - (previous.currencies?.[currencyId] ?? 0)
        if (gained <= 0) continue

        const currency = CURRENCY_DATA_BY_ID["currency:" + currencyId]
        gains.push({
            key: "currency:" + currencyId,
            text: "+" + formatGainAmount(gained) + " " + (currency?.name ?? currencyId),
        })
    }

    return gains
}

export function GameProvider({ children }) {
    const [player, dispatch] = useReducer(gameReducer, undefined, loadPlayerState)
    const { showToast } = useToast()
    const playerRef = useRef(player)
    const latestPlayerRef = useRef(player)
    const notificationPlayerRef = useRef(player)
    const suppressNotificationsRef = useRef(false)
    const lastTickRef = useRef(0)
    const offlineTaskRef = useRef(null)
    const progressStoreRef = useRef(null)
    if (!progressStoreRef.current) {
        progressStoreRef.current = createGameProgressStore()
        progressStoreRef.current.updatePlayer(player)
        updateActionReadiness(progressStoreRef.current, player)
    }
    const progressStore = progressStoreRef.current
    const [displayPlayer, setDisplayPlayer] = useState(player)
    const [isGameReady, setIsGameReady] = useState(false)
    const [offlineProgress, setOfflineProgress] = useState({
        visible: false,
        totalMs: 0,
        processedMs: 0,
        feed: [],
        completed: false,
    })

    // Keep the simulation state current without publishing every 100 ms tick
    // through the main UI context. Only discrete, visible changes are published.
    useEffect(() => {
        const previousPlayer = latestPlayerRef.current
        latestPlayerRef.current = player
        playerRef.current = player
        progressStore.updatePlayer(player)

        if (hasVisiblePlayerChanges(previousPlayer, player)) {
            updateActionReadiness(progressStore, player)

            if (suppressNotificationsRef.current) {
                // Make the hydrated state the toast baseline before publishing it.
                notificationPlayerRef.current = player
                suppressNotificationsRef.current = false
            }

            setDisplayPlayer(player)
        } else {
            // Offline catch-up can change only Mana or partial action progress.
            // Neither needs a UI-context update or a later notification suppression.
            if (suppressNotificationsRef.current) {
                suppressNotificationsRef.current = false
            }

            if (previousPlayer.mana?.current !== player.mana?.current) {
                // Mana regenerates continuously, but only action buttons whose
                // affordability changes are notified; the Mana bar has its own subscriber.
                updateActionReadiness(progressStore, player, true)
            }
        }
    }, [player, progressStore])

    // Notify about live progression changes. Offline catch-up is handled as a
    // summary, so its many level-ups do not create a flood of individual toasts.
    useEffect(() => {
        const previousPlayer = notificationPlayerRef.current
        notificationPlayerRef.current = displayPlayer

        if (previousPlayer === displayPlayer) return
        if (suppressNotificationsRef.current) {
            suppressNotificationsRef.current = false
            return
        }

        for (const skill of SKILL_CONFIGS) {
            for (const action of skill.actions) {
                const previousLevel = previousPlayer.skills?.[skill.id]?.actions?.[action.id]?.level ?? 1
                const currentLevel = displayPlayer.skills?.[skill.id]?.actions?.[action.id]?.level ?? 1

                if (currentLevel > previousLevel) {
                    const actionName = action.name ?? humanize(action.id.replace(/^action:/, ""))
                    showToast({
                        title: "Action Level Up",
                        message: actionName + " reached Level " + currentLevel + ".",
                        type: skill.variant,
                        duration: 3800,
                    })
                }
            }

            const previousSkillLevel = getSkillProgress(previousPlayer, skill.id)?.level ?? 1
            const currentSkillLevel = getSkillProgress(displayPlayer, skill.id)?.level ?? 1

            if (currentSkillLevel > previousSkillLevel) {
                const skillName = getSkillName(skill.id)
                showToast({
                    title: "Skill Level Up",
                    message: skillName + " reached Level " + currentSkillLevel + ".",
                    type: skill.variant,
                    duration: 4500,
                })

                if (displayPlayer.unlockedSkills?.includes(skill.id)) {
                    for (const milestone of skill.milestones ?? []) {
                        if (
                            Number.isFinite(milestone.level) &&
                            previousSkillLevel < milestone.level &&
                            currentSkillLevel >= milestone.level
                        ) {
                            showToast({
                                title: "Skill Milestone Reached",
                                message: skillName + " Level " + milestone.level + ": " +
                                    getMilestoneEffectDescription(skill, milestone),
                                type: skill.variant,
                                duration: 14000,
                            })
                        }
                    }
                }
            }
        }

        const previousSlots = previousPlayer.inventorySlots ?? 0
        const currentSlots = displayPlayer.inventorySlots ?? previousSlots
        if (currentSlots > previousSlots) {
            showToast({
                title: "Bag Slot Purchased",
                message: "Bag capacity increased from " + previousSlots + " to " + currentSlots + " slots.",
                type: "success",
                duration: 3800,
            })
        }
    }, [displayPlayer, showToast])

    // Show the modal first, then simulate the offline interval in manageable chunks.
    // The task lives in a ref so React StrictMode's effect replay can resume it safely.
    useEffect(() => {
        if (!offlineTaskRef.current) {
            const basePlayer = playerRef.current
            const targetAt = Date.now()
            const totalMs = Math.max(0, targetAt - basePlayer.lastUpdatedAt)
            const initialPlayer = structuredClone(basePlayer)

            offlineTaskRef.current = {
                player: structuredClone(initialPlayer),
                initialPlayer,
                startAt: basePlayer.lastUpdatedAt,
                totalMs,
                processedMs: 0,
                feed: [],
                cancelled: false,
                done: false,
                timeoutId: null,
                chunkMs: Math.min(
                    MAX_OFFLINE_CHUNK_MS,
                    Math.max(1000, Math.ceil(totalMs / MAX_OFFLINE_CHUNKS))
                ),
            }
        }

        const task = offlineTaskRef.current
        task.cancelled = false

        if (task.done) {
            setIsGameReady(true)
            return undefined
        }

        if (task.totalMs <= 1000) {
            if (task.totalMs > 0) {
                const updatedPlayer = advanceGame(
                    task.player,
                    task.totalMs,
                    task.startAt + task.totalMs
                )
                suppressNotificationsRef.current = true
                dispatch({ type: "HYDRATE_PLAYER", player: updatedPlayer })
            }
            task.done = true
            setOfflineProgress(current => ({ ...current, visible: false, completed: true }))
            setIsGameReady(true)
            return undefined
        }

        setOfflineProgress(current => ({
            ...current,
            visible: true,
            totalMs: task.totalMs,
        }))

        const processChunk = () => {
            if (task.cancelled || task.done) return

            const deltaMs = Math.min(task.chunkMs, task.totalMs - task.processedMs)
            if (deltaMs <= 0) return

            const previousPlayer = task.player
            const nextProcessedMs = task.processedMs + deltaMs
            task.player = advanceGame(
                previousPlayer,
                deltaMs,
                task.startAt + nextProcessedMs
            )
            task.processedMs = nextProcessedMs

            task.feed = getOfflineGains(task.initialPlayer, task.player)

            const completed = task.processedMs >= task.totalMs
            setOfflineProgress({
                visible: true,
                totalMs: task.totalMs,
                processedMs: task.processedMs,
                feed: task.feed,
                completed,
            })

            if (completed) {
                task.done = true
                task.timeoutId = null
                suppressNotificationsRef.current = true
                dispatch({ type: "HYDRATE_PLAYER", player: task.player })
                setIsGameReady(true)
            } else {
                task.timeoutId = window.setTimeout(processChunk, OFFLINE_CHUNK_DELAY_MS)
            }
        }

        task.timeoutId = window.setTimeout(
            processChunk,
            task.processedMs === 0 ? FIRST_OFFLINE_CHUNK_DELAY_MS : OFFLINE_CHUNK_DELAY_MS
        )

        return () => {
            task.cancelled = true
            if (task.timeoutId !== null) {
                window.clearTimeout(task.timeoutId)
                task.timeoutId = null
            }
        }
    }, [])

    // Regular ticks do not begin until the offline state has been committed.
    useEffect(() => {
        if (!isGameReady) return undefined

        lastTickRef.current = Date.now()
        const intervalId = window.setInterval(() => {
            const now = Date.now()
            const deltaMs = Math.max(0, now - lastTickRef.current)
            lastTickRef.current = now

            if (deltaMs > 0) {
                dispatch({ type: "TICK", deltaMs, now })
            }
        }, TICK_INTERVAL_MS)

        return () => window.clearInterval(intervalId)
    }, [isGameReady])

    // Persist only after offline simulation is committed; page exit during loading
    // leaves the old timestamp intact so the interval can be retried on next launch.
    useEffect(() => {
        if (!isGameReady) return undefined

        const intervalId = window.setInterval(() => {
            savePlayerState(playerRef.current)
        }, SAVE_INTERVAL_MS)

        const saveOnExit = () => savePlayerState(playerRef.current)
        window.addEventListener("pagehide", saveOnExit)

        return () => {
            window.clearInterval(intervalId)
            window.removeEventListener("pagehide", saveOnExit)
            savePlayerState(playerRef.current)
        }
    }, [isGameReady])

    const startAction = useCallback((skillId, actionId) => {
        dispatch({ type: "START_ACTION", skillId, actionId })
    }, [])

    const stopAction = useCallback((skillId, actionId) => {
        dispatch({ type: "STOP_ACTION", skillId, actionId })
    }, [])

    const togglePassiveAction = useCallback((skillId, actionId, running) => {
        dispatch({ type: "TOGGLE_PASSIVE_ACTION", skillId, actionId, running })
    }, [])

    const unlockAction = useCallback((skillId, actionId) => {
        dispatch({ type: "UNLOCK_ACTION", skillId, actionId })
    }, [])

    const unlockSkill = useCallback((skillId) => {
        dispatch({ type: "UNLOCK_SKILL", skillId })
    }, [])

    const buyBagSlot = useCallback(() => {
        dispatch({ type: "BUY_BAG_SLOT" })
    }, [])

    const buyShopItem = useCallback((itemId) => {
        dispatch({ type: "BUY_SHOP_ITEM", itemId })
    }, [])

    const sellItem = useCallback((itemId, amount) => {
        dispatch({ type: "SELL_ITEM", itemId, amount })
    }, [])

    const turnInMission = useCallback((missionId) => {
        dispatch({ type: "TURN_IN_MISSION", missionId })
    }, [])

    const selectActionItem = useCallback((skillId, actionId, itemId) => {
        dispatch({ type: "SELECT_ACTION_ITEM", skillId, actionId, itemId })
    }, [])

    const unlockCompanionSlot = useCallback(slotId => {
        dispatch({ type: "UNLOCK_COMPANION_SLOT", slotId })
    }, [])

    const selectCompanion = useCallback((slotId, companionId) => {
        dispatch({ type: "SELECT_COMPANION", slotId, companionId })
    }, [])

    const contextValue = useMemo(() => ({
        player: displayPlayer,
        progressStore,
        startAction,
        stopAction,
        togglePassiveAction,
        unlockAction,
        unlockSkill,
        buyBagSlot,
        buyShopItem,
        sellItem,
        turnInMission,
        selectActionItem,
        unlockCompanionSlot,
        selectCompanion,
    }), [displayPlayer, progressStore, startAction, stopAction, togglePassiveAction, unlockAction, unlockSkill, buyBagSlot, buyShopItem, sellItem, turnInMission, selectActionItem, unlockCompanionSlot, selectCompanion])

    const continueFromOffline = useCallback(() => {
        setOfflineProgress(current => ({ ...current, visible: false }))
    }, [])

    return (
        <GameContext.Provider value={contextValue}>
            {children}
            <OfflineProgressModal progress={offlineProgress} onContinue={continueFromOffline} />
        </GameContext.Provider>
    )
}
