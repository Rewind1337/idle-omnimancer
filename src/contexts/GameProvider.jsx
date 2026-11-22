import {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from "react"

import { GameContext } from "./GameContext"
import { gameReducer } from "../game/gameReducer"
import { advanceGame, getSkillProgress } from "../game/gameEngine"
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
    const notificationPlayerRef = useRef(player)
    const suppressNotificationsRef = useRef(false)
    const lastTickRef = useRef(0)
    const offlineTaskRef = useRef(null)
    const [isGameReady, setIsGameReady] = useState(false)
    const [offlineProgress, setOfflineProgress] = useState({
        visible: false,
        totalMs: 0,
        processedMs: 0,
        feed: [],
        completed: false,
    })

    // Keep a current reference for the independent save interval and page exit.
    useEffect(() => {
        playerRef.current = player
    }, [player])

    // Notify about live progression changes. Offline catch-up is handled as a
    // summary, so its many level-ups do not create a flood of individual toasts.
    useEffect(() => {
        const previousPlayer = notificationPlayerRef.current
        notificationPlayerRef.current = player

        if (previousPlayer === player) return
        if (suppressNotificationsRef.current) {
            suppressNotificationsRef.current = false
            return
        }

        for (const skill of SKILL_CONFIGS) {
            for (const action of skill.actions) {
                const previousLevel = previousPlayer.skills?.[skill.id]?.actions?.[action.id]?.level ?? 1
                const currentLevel = player.skills?.[skill.id]?.actions?.[action.id]?.level ?? 1

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
            const currentSkillLevel = getSkillProgress(player, skill.id)?.level ?? 1

            if (currentSkillLevel > previousSkillLevel) {
                const skillName = getSkillName(skill.id)
                showToast({
                    title: "Skill Level Up",
                    message: skillName + " reached Level " + currentSkillLevel + ".",
                    type: skill.variant,
                    duration: 4500,
                })

                if (player.unlockedSkills?.includes(skill.id)) {
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
        const currentSlots = player.inventorySlots ?? previousSlots
        if (currentSlots > previousSlots) {
            showToast({
                title: "Bag Slot Purchased",
                message: "Bag capacity increased from " + previousSlots + " to " + currentSlots + " slots.",
                type: "success",
                duration: 3800,
            })
        }
    }, [player, showToast])

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

    const unlockCompanionSlot = useCallback(element => {
        dispatch({ type: "UNLOCK_COMPANION_SLOT", element })
    }, [])

    const selectCompanion = useCallback((element, companionId) => {
        dispatch({ type: "SELECT_COMPANION", element, companionId })
    }, [])

    const contextValue = useMemo(() => ({
        player,
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
    }), [player, startAction, stopAction, togglePassiveAction, unlockAction, unlockSkill, buyBagSlot, buyShopItem, sellItem, turnInMission, selectActionItem, unlockCompanionSlot, selectCompanion])

    const continueFromOffline = () => {
        setOfflineProgress(current => ({ ...current, visible: false }))
    }

    return (
        <GameContext.Provider value={contextValue}>
            {children}
            <OfflineProgressModal progress={offlineProgress} onContinue={continueFromOffline} />
        </GameContext.Provider>
    )
}
