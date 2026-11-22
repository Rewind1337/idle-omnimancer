const EMPTY_ACTION_PROGRESS = Object.freeze({ progressMs: 0 })

const createKey = (skillId, actionId) => skillId + "::" + actionId

const notifyListeners = (listeners, key) => {
    listeners.get(key)?.forEach(listener => listener())
}

const addListener = (listeners, key, listener) => {
    let entries = listeners.get(key)
    if (!entries) {
        entries = new Set()
        listeners.set(key, entries)
    }

    entries.add(listener)
    return () => {
        entries.delete(listener)
        if (entries.size === 0) listeners.delete(key)
    }
}

// Keeps high-frequency values outside the main game context. Subscribers only
// update when their own action progress, readiness, or Mana value changes.
export const createGameProgressStore = () => {
    const actionProgress = new Map()
    const actionProgressListeners = new Map()
    const actionCanStart = new Map()
    const actionCanStartListeners = new Map()
    const manaListeners = new Set()
    let activeActionKey = null
    let manaCurrent = 0

    return {
        getActionProgress(skillId, actionId) {
            return actionProgress.get(createKey(skillId, actionId)) ?? EMPTY_ACTION_PROGRESS
        },

        subscribeActionProgress(skillId, actionId, listener) {
            return addListener(actionProgressListeners, createKey(skillId, actionId), listener)
        },

        getActionCanStart(skillId, actionId, fallback) {
            const key = createKey(skillId, actionId)
            return actionCanStart.has(key) ? actionCanStart.get(key) : fallback
        },

        setActionCanStart(skillId, actionId, canStart) {
            const key = createKey(skillId, actionId)
            if (actionCanStart.has(key) && actionCanStart.get(key) === canStart) return

            actionCanStart.set(key, canStart)
            notifyListeners(actionCanStartListeners, key)
        },

        subscribeActionCanStart(skillId, actionId, listener) {
            return addListener(actionCanStartListeners, createKey(skillId, actionId), listener)
        },

        getManaCurrent() {
            return manaCurrent
        },

        subscribeMana(listener) {
            manaListeners.add(listener)
            return () => manaListeners.delete(listener)
        },

        updatePlayer(player) {
            const activeAction = player.activeAction
            const nextActionKey = activeAction
                ? createKey(activeAction.skillId, activeAction.actionId)
                : null

            if (activeActionKey && activeActionKey !== nextActionKey) {
                actionProgress.delete(activeActionKey)
                notifyListeners(actionProgressListeners, activeActionKey)
            }

            if (activeAction && nextActionKey) {
                const progressMs = player.skills?.[activeAction.skillId]?.actions?.[activeAction.actionId]?.progressMs ?? 0
                const previous = actionProgress.get(nextActionKey)

                if (!previous || previous.progressMs !== progressMs) {
                    actionProgress.set(nextActionKey, { progressMs })
                    notifyListeners(actionProgressListeners, nextActionKey)
                }
            }

            activeActionKey = nextActionKey

            const nextManaCurrent = Number(player.mana?.current) || 0
            if (nextManaCurrent !== manaCurrent) {
                manaCurrent = nextManaCurrent
                manaListeners.forEach(listener => listener())
            }
        },
    }
}
