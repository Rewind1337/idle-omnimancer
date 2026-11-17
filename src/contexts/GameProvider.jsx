import {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
} from "react"

import { GameContext } from "./GameContext"
import { gameReducer } from "../game/gameReducer"
import {
    loadPlayerState,
    savePlayerState,
} from "../game/playerState"

const TICK_INTERVAL_MS = 100
const SAVE_INTERVAL_MS = 1000

export function GameProvider({ children }) {
    const [player, dispatch] = useReducer(gameReducer, undefined, loadPlayerState)
    const playerRef = useRef(player)
    const lastTickRef = useRef(Date.now())
    const initializedRef = useRef(false)

    // Keep a current reference for the independent save interval and page exit.
    playerRef.current = player

    useEffect(() => {
        // Apply elapsed time since the previous save once, before regular ticks.
        // The ref prevents React StrictMode's development effect replay from
        // applying the same offline interval twice.
        if (!initializedRef.current) {
            initializedRef.current = true
            const now = Date.now()
            const offlineMs = Math.max(0, now - playerRef.current.lastUpdatedAt)
            if (offlineMs > 0) {
                dispatch({ type: "OFFLINE_PROGRESS", deltaMs: offlineMs, now })
            }
            lastTickRef.current = now
        }

        const intervalId = window.setInterval(() => {
            const now = Date.now()
            const deltaMs = Math.max(0, now - lastTickRef.current)
            lastTickRef.current = now

            if (deltaMs > 0) {
                dispatch({ type: "TICK", deltaMs, now })
            }
        }, TICK_INTERVAL_MS)

        return () => window.clearInterval(intervalId)
    }, [])

    // Persist at a lower frequency than the simulation tick. The latest
    // in-memory state is also saved when the page is being closed or hidden.
    useEffect(() => {
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
    }, [])

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

    const sellItem = useCallback((itemId, amount) => {
        dispatch({ type: "SELL_ITEM", itemId, amount })
    }, [])

    const contextValue = useMemo(() => ({
        player,
        startAction,
        stopAction,
        togglePassiveAction,
        unlockAction,
        unlockSkill,
        buyBagSlot,
        sellItem,
    }), [player, startAction, stopAction, togglePassiveAction, unlockAction, unlockSkill, buyBagSlot, sellItem])

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    )
}
