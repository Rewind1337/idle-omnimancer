import { useCallback, useContext, useSyncExternalStore } from "react"

import { GameContext, GameServicesContext } from "../contexts/GameContext"

export function useGame() {
    const context = useContext(GameContext)

    if (!context) {
        throw new Error("useGame must be used within a GameProvider.")
    }

    return context
}

function useGameServices() {
    const context = useContext(GameServicesContext)

    if (!context) {
        throw new Error("Game store hooks must be used within a GameProvider.")
    }

    return context
}

export function useGameActions() {
    return useGameServices().commands
}

export function useGameActionProgress(skillId, actionId) {
    const { progressStore } = useGameServices()
    const subscribe = useCallback(
        listener => progressStore.subscribeActionProgress(skillId, actionId, listener),
        [progressStore, skillId, actionId]
    )
    const getSnapshot = useCallback(
        () => progressStore.getActionProgress(skillId, actionId),
        [progressStore, skillId, actionId]
    )

    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export function useGameActionCanStart(skillId, actionId, fallback = true) {
    const { progressStore } = useGameServices()
    const subscribe = useCallback(
        listener => progressStore.subscribeActionCanStart(skillId, actionId, listener),
        [progressStore, skillId, actionId]
    )
    const getSnapshot = useCallback(
        () => progressStore.getActionCanStart(skillId, actionId, fallback),
        [progressStore, skillId, actionId, fallback]
    )

    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export function useGameManaCurrent() {
    const { progressStore } = useGameServices()
    const subscribe = useCallback(
        listener => progressStore.subscribeMana(listener),
        [progressStore]
    )
    const getSnapshot = useCallback(
        () => progressStore.getManaCurrent(),
        [progressStore]
    )

    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

function useGameStoreSnapshot(subscribeMethod, getSnapshotMethod) {
    const { progressStore } = useGameServices()
    const subscribe = useCallback(
        listener => progressStore[subscribeMethod](listener),
        [progressStore, subscribeMethod]
    )
    const getSnapshot = useCallback(
        () => progressStore[getSnapshotMethod](),
        [progressStore, getSnapshotMethod]
    )

    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export const useGameInventory = () =>
    useGameStoreSnapshot("subscribeInventory", "getInventory")

export const useGameCurrencies = () =>
    useGameStoreSnapshot("subscribeCurrencies", "getCurrencies")

export const useGameInventorySlots = () =>
    useGameStoreSnapshot("subscribeInventorySlots", "getInventorySlots")

export const useGameUnlockedSkills = () =>
    useGameStoreSnapshot("subscribeUnlockedSkills", "getUnlockedSkills")

export const useGameUnlockedCompanions = () =>
    useGameStoreSnapshot("subscribeUnlockedCompanions", "getUnlockedCompanions")
