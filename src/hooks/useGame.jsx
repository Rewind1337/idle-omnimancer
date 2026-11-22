import { useCallback, useContext, useSyncExternalStore } from "react"

import { GameContext } from "../contexts/GameContext"

export function useGame() {
    const context = useContext(GameContext)

    if (!context) {
        throw new Error("useGame must be used within a GameProvider.")
    }

    return context
}

export function useGameActionProgress(skillId, actionId) {
    const { progressStore } = useGame()
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
    const { progressStore } = useGame()
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
    const { progressStore } = useGame()
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
