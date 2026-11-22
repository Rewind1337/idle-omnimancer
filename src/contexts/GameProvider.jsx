import {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from "react"

import { GameContext, GameServicesContext } from "./GameContext"
import { createGameProgressStore } from "./GameProgressStore"
import { gameReducer } from "../game/gameReducer"
import { advanceGame, canStartAction, getSkillProgress } from "../game/gameEngine"
import {
    loadPlayerState,
    savePlayerState,
} from "../game/playerState"
import { ITEM_DATA_BY_ID, CURRENCY_DATA_BY_ID } from "../data/itemData"
import { SKILL_CONFIGS } from "../data/skillConfig"
import { COMPANION_DATA } from "../data/companionData"
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
        previous.researchBreakthroughTier !== next.researchBreakthroughTier ||
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

const updateActionReadiness = (progressStore, player) => {
    for (const skill of SKILL_CONFIGS) {
        if (!player.unlockedSkills?.includes(skill.id)) continue

        for (const action of skill.actions) {
            if (!player.skills?.[skill.id]?.actions?.[action.id]?.unlocked) continue

            progressStore.setActionCanStart(
                skill.id,
                action.id,
                canStartAction(player, skill.id, action.id)
            )
        }
    }
}

const ACTION_METADATA_BY_KEY = new Map()
const ACTION_KEYS_BY_SKILL = new Map()
const ACTION_KEYS_BY_RESOURCE = new Map()
const FLEXIBLE_INPUT_ACTION_KEYS = new Set()
const MANA_ACTION_KEYS = new Set()
const COMPANION_TRAINING_ACTION_KEYS = new Set()

const addActionResourceDependency = (resourceId, actionKey) => {
    let actionKeys = ACTION_KEYS_BY_RESOURCE.get(resourceId)
    if (!actionKeys) {
        actionKeys = new Set()
        ACTION_KEYS_BY_RESOURCE.set(resourceId, actionKeys)
    }
    actionKeys.add(actionKey)
}

for (const skill of SKILL_CONFIGS) {
    const skillActionKeys = new Set()
    ACTION_KEYS_BY_SKILL.set(skill.id, skillActionKeys)

    for (const action of skill.actions) {
        const key = skill.id + "::" + action.id
        const metadata = {
            key,
            skillId: skill.id,
            actionId: action.id,
            hasManaCost: Boolean(skill.mana?.cost) || Number(action.manaCost) > 0,
            isCompanionTraining: Boolean(action.companionTraining),
        }

        ACTION_METADATA_BY_KEY.set(key, metadata)
        skillActionKeys.add(key)

        if (metadata.hasManaCost) MANA_ACTION_KEYS.add(key)
        if (metadata.isCompanionTraining) COMPANION_TRAINING_ACTION_KEYS.add(key)

        if (action.inputSelection) {
            FLEXIBLE_INPUT_ACTION_KEYS.add(key)
        } else if (metadata.isCompanionTraining) {
            addActionResourceDependency("currency:coins", key)
        } else {
            for (const entry of Array.isArray(action.consumes) ? action.consumes : []) {
                const itemId = typeof entry === "string" ? entry : entry?.item
                if (typeof itemId === "string" && itemId) {
                    addActionResourceDependency(itemId, key)
                }
            }
        }
    }
}

const getChangedRecordKeys = (previous = {}, next = {}) => {
    const keys = new Set([...Object.keys(previous), ...Object.keys(next)])
    return [...keys].filter(key => !Object.is(previous[key], next[key]))
}

const getChangedCompanionLevels = (previous = {}, next = {}) => {
    const ids = new Set([...Object.keys(previous), ...Object.keys(next)])
    return [...ids].filter(id =>
        !Object.is(previous[id]?.level, next[id]?.level)
    )
}

const getActiveCompanionIds = player => new Set(
    Object.values(player.activeCompanionSlots ?? {})
        .filter(companionId => companionId && player.unlockedCompanions?.includes(companionId))
)

const updateManaActionReadiness = (progressStore, player) => {
    for (const key of MANA_ACTION_KEYS) {
        const metadata = ACTION_METADATA_BY_KEY.get(key)
        if (
            !player.unlockedSkills?.includes(metadata.skillId) ||
            !player.skills?.[metadata.skillId]?.actions?.[metadata.actionId]?.unlocked
        ) continue

        progressStore.setActionCanStart(
            metadata.skillId,
            metadata.actionId,
            canStartAction(player, metadata.skillId, metadata.actionId)
        )
    }
}

const updateActionReadinessForChanges = (progressStore, previous, next) => {
    const affectedActions = new Set()
    const changedSkillIds = new Set()

    const addSkillActions = (skillId, predicate = () => true) => {
        for (const key of ACTION_KEYS_BY_SKILL.get(skillId) ?? []) {
            if (predicate(ACTION_METADATA_BY_KEY.get(key))) affectedActions.add(key)
        }
    }

    const addMilestoneTargets = (sourceSkill, milestone) => {
        const targetSkillId = milestone.reach === "global"
            ? null
            : milestone.reach === "local"
                ? sourceSkill.id
                : milestone.reach
        const isRelevant = metadata => milestone.effect === "manaCost"
            ? metadata.hasManaCost
            : metadata.isCompanionTraining

        if (targetSkillId === null) {
            for (const [key, metadata] of ACTION_METADATA_BY_KEY) {
                if (isRelevant(metadata)) affectedActions.add(key)
            }
        } else {
            addSkillActions(targetSkillId, isRelevant)
        }
    }

    // Inventory and currency balances only affect actions that actually consume
    // those resources. Selection-based actions are flexible, so check those when
    // an inventory entry changes.
    const changedInventoryIds = getChangedRecordKeys(previous.inventory, next.inventory)
    for (const itemId of changedInventoryIds) {
        for (const key of ACTION_KEYS_BY_RESOURCE.get(itemId) ?? []) affectedActions.add(key)
    }
    if (changedInventoryIds.length > 0) {
        for (const key of FLEXIBLE_INPUT_ACTION_KEYS) affectedActions.add(key)
    }

    const changedCurrencyIds = getChangedRecordKeys(previous.currencies, next.currencies)
    for (const currencyId of changedCurrencyIds) {
        for (const key of ACTION_KEYS_BY_RESOURCE.get("currency:" + currencyId) ?? []) {
            affectedActions.add(key)
        }
    }

    // Action unlocks, selected input items, and action levels can change one
    // action's readiness or one of its repeated Mana/Gold-cost milestones.
    for (const skill of SKILL_CONFIGS) {
        const previousActions = previous.skills?.[skill.id]?.actions ?? {}
        const nextActions = next.skills?.[skill.id]?.actions ?? {}

        for (const action of skill.actions) {
            const previousAction = previousActions[action.id]
            const nextAction = nextActions[action.id]
            if (!previousAction?.unlocked && !nextAction?.unlocked) continue

            if (
                !previousAction ||
                !nextAction ||
                ["unlocked", "level", "selectedItemId"].some(field =>
                    !Object.is(previousAction[field], nextAction[field])
                )
            ) {
                affectedActions.add(skill.id + "::" + action.id)
            }

            if (!Object.is(previousAction?.level, nextAction?.level)) {
                changedSkillIds.add(skill.id)
            }
        }
    }

    const previousUnlockedSkills = new Set(previous.unlockedSkills ?? [])
    const nextUnlockedSkills = new Set(next.unlockedSkills ?? [])
    for (const skill of SKILL_CONFIGS) {
        if (previousUnlockedSkills.has(skill.id) !== nextUnlockedSkills.has(skill.id)) {
            changedSkillIds.add(skill.id)
            addSkillActions(skill.id)
        }
    }

    const changedCompanionLevels = getChangedCompanionLevels(
        previous.companionProgress,
        next.companionProgress
    )
    if (changedCompanionLevels.length > 0) changedSkillIds.add("skill:companions")

    // Skill milestones can change action Mana costs or the companion-training
    // Gold cost when a source skill crosses a milestone level.
    for (const skill of SKILL_CONFIGS) {
        if (!changedSkillIds.has(skill.id)) continue

        const previousLevel = getSkillProgress(previous, skill.id)?.level ?? 1
        const nextLevel = getSkillProgress(next, skill.id)?.level ?? 1
        if (previousLevel === nextLevel &&
            previousUnlockedSkills.has(skill.id) === nextUnlockedSkills.has(skill.id)) continue

        // Selected inputs can become eligible as the player's Unveiling level rises.
        if (skill.id === "skill:unveiling" && previousLevel !== nextLevel) {
            for (const key of FLEXIBLE_INPUT_ACTION_KEYS) affectedActions.add(key)
        }

        for (const milestone of skill.milestones ?? []) {
            if (!Number.isFinite(milestone.level) ||
                !["manaCost", "baseGoldCost"].includes(milestone.effect)) continue

            const wasActive = previousUnlockedSkills.has(skill.id) && previousLevel >= milestone.level
            const isActive = nextUnlockedSkills.has(skill.id) && nextLevel >= milestone.level
            if (wasActive !== isActive) addMilestoneTargets(skill, milestone)
        }
    }

    // Companion levels affect permanent and active effects; active assignments
    // also change the training action's dynamic coin cost and trainable targets.
    const previousActiveCompanions = getActiveCompanionIds(previous)
    const nextActiveCompanions = getActiveCompanionIds(next)
    const activeCompanionsChanged =
        previousActiveCompanions.size !== nextActiveCompanions.size ||
        [...previousActiveCompanions].some(id => !nextActiveCompanions.has(id))

    if (activeCompanionsChanged) {
        for (const key of COMPANION_TRAINING_ACTION_KEYS) affectedActions.add(key)
    }

    const previousUnlockedCompanions = new Set(previous.unlockedCompanions ?? [])
    const nextUnlockedCompanions = new Set(next.unlockedCompanions ?? [])
    for (const companion of COMPANION_DATA) {
        const wasUnlocked = previousUnlockedCompanions.has(companion.id)
        const isUnlocked = nextUnlockedCompanions.has(companion.id)
        const wasActive = previousActiveCompanions.has(companion.id)
        const isActive = nextActiveCompanions.has(companion.id)
        const levelChanged = changedCompanionLevels.includes(companion.id)

        if ((wasUnlocked || isUnlocked) &&
            (wasUnlocked !== isUnlocked || levelChanged) &&
            companion.permanentEffect?.effect === "manaCost") {
            for (const key of MANA_ACTION_KEYS) affectedActions.add(key)
        }

        if ((wasActive || isActive) &&
            (wasActive !== isActive || levelChanged) &&
            companion.activeEffect?.effect === "manaCost") {
            addSkillActions(companion.activeEffect.targetSkillId, metadata => metadata.hasManaCost)
        }

        if ((wasActive || isActive) && levelChanged) {
            for (const key of COMPANION_TRAINING_ACTION_KEYS) affectedActions.add(key)
        }
    }

    // Mana regenerates continuously; only Mana-consuming actions need to have
    // their affordability checked when the current pool changes.
    if (!Object.is(previous.mana?.current, next.mana?.current)) {
        for (const key of MANA_ACTION_KEYS) affectedActions.add(key)
    }

    for (const key of affectedActions) {
        const metadata = ACTION_METADATA_BY_KEY.get(key)
        if (!metadata) continue

        const previousAction = previous.skills?.[metadata.skillId]?.actions?.[metadata.actionId]
        const nextAction = next.skills?.[metadata.skillId]?.actions?.[metadata.actionId]
        if (!previousAction?.unlocked && !nextAction?.unlocked) continue

        progressStore.setActionCanStart(
            metadata.skillId,
            metadata.actionId,
            canStartAction(next, metadata.skillId, metadata.actionId)
        )
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
    const [progressStore] = useState(() => {
        const store = createGameProgressStore()
        store.updatePlayer(player)
        store.updateVisiblePlayer(player)
        updateActionReadiness(store, player)
        return store
    })
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
            progressStore.updateVisiblePlayer(player)
            updateActionReadinessForChanges(progressStore, previousPlayer, player)

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
                updateManaActionReadiness(progressStore, player)
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

    const buyResearchBreakthrough = useCallback(() => {
        dispatch({ type: "BUY_RESEARCH_BREAKTHROUGH" })
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

    const commands = useMemo(() => ({
        startAction,
        stopAction,
        togglePassiveAction,
        unlockAction,
        unlockSkill,
        buyBagSlot,
        buyResearchBreakthrough,
        buyShopItem,
        sellItem,
        turnInMission,
        selectActionItem,
        unlockCompanionSlot,
        selectCompanion,
    }), [startAction, stopAction, togglePassiveAction, unlockAction, unlockSkill, buyBagSlot, buyResearchBreakthrough, buyShopItem, sellItem, turnInMission, selectActionItem, unlockCompanionSlot, selectCompanion])

    const servicesValue = useMemo(() => ({
        progressStore,
        commands,
    }), [progressStore, commands])

    const contextValue = useMemo(() => ({
        player: displayPlayer,
        progressStore,
        ...commands,
    }), [displayPlayer, progressStore, commands])

    const continueFromOffline = useCallback(() => {
        setOfflineProgress(current => ({ ...current, visible: false }))
    }, [])

    return (
        <GameServicesContext.Provider value={servicesValue}>
            <GameContext.Provider value={contextValue}>
                {children}
                <OfflineProgressModal progress={offlineProgress} onContinue={continueFromOffline} />
            </GameContext.Provider>
        </GameServicesContext.Provider>
    )
}
