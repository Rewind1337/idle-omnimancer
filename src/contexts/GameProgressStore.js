const EMPTY_ACTION_PROGRESS = Object.freeze({ progressMs: 0 })
const EMPTY_RECORD = Object.freeze({})
const EMPTY_ARRAY = Object.freeze([])

const createKey = (skillId, actionId) => skillId + "::" + actionId

const notifyListeners = (listeners, key) => {
    listeners.get(key)?.forEach(listener => listener())
}

const notifySet = listeners => listeners.forEach(listener => listener())

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

const areSameRecord = (first = {}, second = {}) => {
    const firstKeys = Object.keys(first)
    const secondKeys = Object.keys(second)
    return firstKeys.length === secondKeys.length &&
        firstKeys.every(key => Object.is(first[key], second[key]))
}

const areSameArray = (first = [], second = []) =>
    first.length === second.length &&
    first.every((value, index) => value === second[index])

// Keeps high-frequency values and selected player domains outside the main
// context. Each subscriber is notified only when its own snapshot changes.
export const createGameProgressStore = () => {
    const actionProgress = new Map()
    const actionProgressListeners = new Map()
    const actionCanStart = new Map()
    const actionCanStartListeners = new Map()
    const manaListeners = new Set()

    const inventoryListeners = new Set()
    const currenciesListeners = new Set()
    const inventorySlotsListeners = new Set()
    const unlockedSkillsListeners = new Set()
    const unlockedCompanionsListeners = new Set()

    let activeActionKey = null
    let manaCurrent = 0
    let inventory = EMPTY_RECORD
    let currencies = EMPTY_RECORD
    let inventorySlots = null
    let unlockedSkills = EMPTY_ARRAY
    let unlockedCompanions = EMPTY_ARRAY

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

        getInventory() {
            return inventory
        },

        subscribeInventory(listener) {
            inventoryListeners.add(listener)
            return () => inventoryListeners.delete(listener)
        },

        getCurrencies() {
            return currencies
        },

        subscribeCurrencies(listener) {
            currenciesListeners.add(listener)
            return () => currenciesListeners.delete(listener)
        },

        getInventorySlots() {
            return inventorySlots
        },

        subscribeInventorySlots(listener) {
            inventorySlotsListeners.add(listener)
            return () => inventorySlotsListeners.delete(listener)
        },

        getUnlockedSkills() {
            return unlockedSkills
        },

        subscribeUnlockedSkills(listener) {
            unlockedSkillsListeners.add(listener)
            return () => unlockedSkillsListeners.delete(listener)
        },

        getUnlockedCompanions() {
            return unlockedCompanions
        },

        subscribeUnlockedCompanions(listener) {
            unlockedCompanionsListeners.add(listener)
            return () => unlockedCompanionsListeners.delete(listener)
        },

        // Called for every simulation update. This path intentionally handles
        // only the high-frequency action-progress and Mana snapshots.
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
                notifySet(manaListeners)
            }
        },

        // Called only when a discrete, visible player value changes. Keeping
        // these snapshots separate prevents the Bag and navigation from
        // subscribing to every unrelated game-context update.
        updateVisiblePlayer(player) {
            const nextInventory = player.inventory ?? EMPTY_RECORD
            if (!areSameRecord(inventory, nextInventory)) {
                inventory = Object.freeze({ ...nextInventory })
                notifySet(inventoryListeners)
            }

            const nextCurrencies = player.currencies ?? EMPTY_RECORD
            if (!areSameRecord(currencies, nextCurrencies)) {
                currencies = Object.freeze({ ...nextCurrencies })
                notifySet(currenciesListeners)
            }

            const nextInventorySlots = player.inventorySlots ?? null
            if (nextInventorySlots !== inventorySlots) {
                inventorySlots = nextInventorySlots
                notifySet(inventorySlotsListeners)
            }

            const nextUnlockedSkills = player.unlockedSkills ?? EMPTY_ARRAY
            if (!areSameArray(unlockedSkills, nextUnlockedSkills)) {
                unlockedSkills = Object.freeze([...nextUnlockedSkills])
                notifySet(unlockedSkillsListeners)
            }

            const nextUnlockedCompanions = player.unlockedCompanions ?? EMPTY_ARRAY
            if (!areSameArray(unlockedCompanions, nextUnlockedCompanions)) {
                unlockedCompanions = Object.freeze([...nextUnlockedCompanions])
                notifySet(unlockedCompanionsListeners)
            }
        },
    }
}
