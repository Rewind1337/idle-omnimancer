import {
    GLOBAL_CONFIG,
    SKILL_CONFIGS,
    SKILL_CONFIG_BY_ID,
} from "../data/skillConfig"
import { SKILL_NAVIGATION } from "../data/navigationData"
import { ITEM_DATA_BY_ID } from "../data/itemData"
import { MISSION_DATA } from "../data/missionData"
import { COMPANION_IDS, COMPANION_DATA } from "../data/companionData"
import { COMPANION_CONFIG } from "../data/companionConfig"

export const SAVE_KEY = "omnimancer-idle-save"
export const SAVE_VERSION = 5
export const DEFAULT_INVENTORY_SLOTS = GLOBAL_CONFIG.startingBagSpace

// The save contains only serializable player data. Configurations, functions,
// generated XP tables and derived skill levels are deliberately not stored.
export const createInitialPlayerState = () => {
    const defaultUnlockedSkills = new Set(
        SKILL_CONFIGS
            .filter(skill => skill.unlockedByDefault)
            .map(skill => skill.id)
    )

    const skills = Object.fromEntries(
        SKILL_CONFIGS.map(skill => [
            skill.id,
            {
                actions: Object.fromEntries(
                    skill.actions.map(action => [
                        action.id,
                        {
                            unlocked: defaultUnlockedSkills.has(skill.id) && Boolean(action.unlockedByDefault),
                            level: 1,
                            xp: 0,
                            progressMs: 0,
                            selectedItemId: null,
                            // Passive actions remain active once started.
                            // Active actions use the single player.activeAction slot.
                            running: false,
                        },
                    ])
                ),
            },
        ])
    )

    const spellcraft = SKILL_CONFIG_BY_ID["skill:spellcraft"]

    return {
        version: SAVE_VERSION,
        lastUpdatedAt: Date.now(),
        unlockedSkills: SKILL_NAVIGATION
            .filter(({ skillId }) => defaultUnlockedSkills.has(skillId))
            .map(({ skillId }) => skillId),
        activeAction: null,
        skills,
        inventory: {},
        inventorySlots: DEFAULT_INVENTORY_SLOTS,
        missionTier: MISSION_DATA.startingTier,
        completedMissions: [],
        unlockedCompanions: [],
        companionProgress: Object.fromEntries(COMPANION_DATA.map(companion => [
            companion.id,
            { level: 0, xp: 0 },
        ])),
        unlockedCompanionSlots: Object.entries(COMPANION_CONFIG.slots)
            .filter(([, slot]) => slot.unlockedByDefault)
            .map(([element]) => element),
        activeCompanionSlots: { any: null, earth: null, air: null, water: null },
        currencies: {
            coins: 0,
            fame: 0,
        },
        mana: {
            current: spellcraft?.mana?.base ?? 0,
            max: spellcraft?.mana?.base ?? 0,
        },
    }
}

// Merge saved values into the current config shape. This means newly added
// skills/actions receive defaults while existing player progress is retained.
export const normalizePlayerState = (savedState) => {
    const initial = createInitialPlayerState()
    if (!savedState || typeof savedState !== "object") return initial

    const validSkillIds = new Set(SKILL_NAVIGATION.map(({ skillId }) => skillId))
    const unlockedSkillIds = new Set(initial.unlockedSkills)
    const legacyCompanionIds = {
        "companion:earth": COMPANION_DATA[0].id,
        "companion:air": COMPANION_DATA[1].id,
        "companion:water": COMPANION_DATA[2].id,
    }
    const unlockedCompanions = [...new Set(
        (Array.isArray(savedState.unlockedCompanions) ? savedState.unlockedCompanions : [])
            .map(id => legacyCompanionIds[id] ?? id)
            .filter(id => COMPANION_IDS.includes(id))
    )]

    if (unlockedCompanions.length > 0) unlockedSkillIds.add("skill:companions")

    if (Array.isArray(savedState.unlockedSkills)) {
        for (const skillId of savedState.unlockedSkills) {
            if (validSkillIds.has(skillId)) unlockedSkillIds.add(skillId)
        }
    }

    const unlockedSkills = SKILL_NAVIGATION
        .filter(({ skillId }) => unlockedSkillIds.has(skillId))
        .map(({ skillId }) => skillId)

    const activeAction = isKnownAction(savedState.activeAction, unlockedSkills)
        ? savedState.activeAction
        : null

    const skills = { ...initial.skills }

    for (const skill of SKILL_CONFIGS) {
        const savedSkill = savedState.skills?.[skill.id]
        const actions = { ...initial.skills[skill.id].actions }

        for (const action of skill.actions) {
            const savedAction = savedSkill?.actions?.[action.id]
            if (!savedAction || typeof savedAction !== "object") continue

            const defaultAction = actions[action.id]
            const isActiveAction = activeAction?.skillId === skill.id &&
                activeAction?.actionId === action.id
            const isRunningPassiveAction =
                (action.activity ?? skill.activity ?? "active") === "passive" &&
                unlockedSkills.includes(skill.id) &&
                Boolean(savedAction.running)
            const selectedItemData = ITEM_DATA_BY_ID[savedAction.selectedItemId]
            const selection = action.inputSelection
            const hasValidSelectedItem = !selection || Boolean(
                selectedItemData &&
                ((selection.groups ?? []).includes(selectedItemData.group) ||
                    (selection.types ?? []).includes(selectedItemData.type))
            )
            const preserveProgress = savedState.version >= SAVE_VERSION ||
                isActiveAction ||
                isRunningPassiveAction

            actions[action.id] = {
                ...defaultAction,
                unlocked: unlockedSkills.includes(skill.id) &&
                    (Boolean(savedAction.unlocked) || defaultAction.unlocked),
                level: clampInteger(savedAction.level, 1, GLOBAL_CONFIG.maxActionLevel, 1),
                xp: Math.max(0, finiteNumber(savedAction.xp, 0)),
                progressMs: preserveProgress
                    ? Math.max(0, finiteNumber(savedAction.progressMs, 0))
                    : 0,
                running: unlockedSkills.includes(skill.id) && Boolean(savedAction.running),
                selectedItemId: hasValidSelectedItem ? (savedAction.selectedItemId ?? null) : null,
            }
        }

        if (unlockedSkills.includes(skill.id)) {
            for (const action of skill.actions) {
                if (!action.unlockedByDefault) continue
                actions[action.id] = {
                    ...actions[action.id],
                    unlocked: true,
                }
            }
        }

        skills[skill.id] = { actions }
    }

    const inventory = Object.fromEntries(
        Object.entries(normalizeNumberMap(savedState.inventory))
            .filter(([itemId]) => ITEM_DATA_BY_ID[itemId])
    )
    const occupiedSlots = Object.values(inventory).filter(amount => amount > 0).length
    const inventorySlots = Math.max(
        occupiedSlots,
        clampInteger(savedState.inventorySlots, DEFAULT_INVENTORY_SLOTS, Number.MAX_SAFE_INTEGER, DEFAULT_INVENTORY_SLOTS)
    )

    const completedMissions = Array.isArray(savedState.completedMissions)
        ? [...new Set(savedState.completedMissions.filter(id =>
            MISSION_DATA.missions.some(mission => mission.id === id)
        ))]
        : initial.completedMissions

    const companionProgress = Object.fromEntries(COMPANION_DATA.map(companion => {
        const savedProgress = savedState.companionProgress?.[companion.id]
        const isUnlocked = unlockedCompanions.includes(companion.id)
        const level = clampInteger(
            savedProgress?.level,
            0,
            COMPANION_CONFIG.companionLeveling.maxLevel,
            isUnlocked ? 1 : 0
        )
        return [companion.id, {
            level: isUnlocked ? Math.max(1, level) : 0,
            xp: isUnlocked && level < COMPANION_CONFIG.companionLeveling.maxLevel
                ? Math.max(0, finiteNumber(savedProgress?.xp, 0))
                : 0,
        }]
    }))

    const validSlotIds = Object.keys(COMPANION_CONFIG.slots)
    const savedActiveSlots = savedState.activeCompanionSlots ?? {}
    const savedUnlockedSlots = Array.isArray(savedState.unlockedCompanionSlots)
        ? savedState.unlockedCompanionSlots
        : []
    const hasAnyElementSlot = Object.prototype.hasOwnProperty.call(savedActiveSlots, "any") ||
        savedUnlockedSlots.includes("any")
    const legacyUnlockedSlots = hasAnyElementSlot
        ? savedUnlockedSlots
        : savedUnlockedSlots.filter(slotId => slotId !== "earth")
    const unlockedCompanionSlots = [...new Set([
        "any",
        ...legacyUnlockedSlots,
    ].filter(slotId =>
        validSlotIds.includes(slotId) && COMPANION_CONFIG.slots[slotId]
    ))]
    const savedSlotAssignments = hasAnyElementSlot
        ? savedActiveSlots
        : { ...savedActiveSlots, any: savedActiveSlots.earth ?? null, earth: null }
    const assignedCompanions = new Set()
    const activeCompanionSlots = Object.fromEntries(validSlotIds.map(slotId => {
        const companionId = savedSlotAssignments[slotId] ?? null
        const companion = COMPANION_DATA.find(entry => entry.id === companionId)
        const slot = COMPANION_CONFIG.slots[slotId]
        const compatible = slot.element === null ||
            companion?.element === "neutral" ||
            companion?.element === slot.element
        const valid = unlockedCompanionSlots.includes(slotId) &&
            companion &&
            compatible &&
            unlockedCompanions.includes(companionId) &&
            !assignedCompanions.has(companionId)
        if (valid) assignedCompanions.add(companionId)
        return [slotId, valid ? companionId : null]
    }))

    let missionTier = clampInteger(
        savedState.missionTier,
        MISSION_DATA.startingTier,
        MISSION_DATA.tierRequirements.length + 1,
        initial.missionTier
    )

    while (missionTier <= MISSION_DATA.tierRequirements.length) {
        const requiredCount = MISSION_DATA.tierRequirements[missionTier - 1]
        if (!Number.isSafeInteger(requiredCount) || requiredCount < 1) break

        const completedCount = MISSION_DATA.missions.filter(mission =>
            mission.tier === missionTier && completedMissions.includes(mission.id)
        ).length

        if (completedCount < requiredCount) break
        missionTier += 1
    }

    return {
        ...initial,
        version: SAVE_VERSION,
        lastUpdatedAt: Math.max(0, finiteNumber(savedState.lastUpdatedAt, Date.now())),
        unlockedSkills,
        activeAction,
        skills,
        inventory,
        inventorySlots,
        missionTier,
        completedMissions,
        unlockedCompanions,
        companionProgress,
        unlockedCompanionSlots,
        activeCompanionSlots,
        currencies: {
            coins: Math.max(0, finiteNumber(
                savedState.currencies?.coins,
                finiteNumber(savedState.currencies?.gold, 0)
            )),
            fame: Math.max(0, finiteNumber(savedState.currencies?.fame, initial.currencies.fame)),
        },
        mana: {
            current: Math.max(0, finiteNumber(savedState.mana?.current, initial.mana.current)),
            max: Math.max(0, finiteNumber(savedState.mana?.max, initial.mana.max)),
        },
    }
}

const finiteNumber = (value, fallback) => {
    const number = Number(value)
    return Number.isFinite(number) ? number : fallback
}

const clampInteger = (value, min, max, fallback) => {
    const number = Number(value)
    return Number.isFinite(number)
        ? Math.min(max, Math.max(min, Math.floor(number)))
        : fallback
}

const normalizeNumberMap = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {}

    return Object.fromEntries(
        Object.entries(value)
            .filter(([, amount]) => Number.isFinite(Number(amount)) && Number(amount) >= 0)
            .map(([id, amount]) => [id, Number(amount)])
    )
}

const isKnownAction = (selection, unlockedSkills) => {
    if (!selection || typeof selection !== "object") return false
    if (!unlockedSkills.includes(selection.skillId)) return false

    const skill = SKILL_CONFIG_BY_ID[selection.skillId]
    return Boolean(skill?.actions.some(action => action.id === selection.actionId))
}

// Read and validate a save. A malformed or inaccessible save safely falls back
// to a fresh state instead of preventing the game from loading.
export const loadPlayerState = () => {
    try {
        const saved = localStorage.getItem(SAVE_KEY)
        if (!saved) return createInitialPlayerState()

        return normalizePlayerState(JSON.parse(saved))
    } catch (error) {
        console.warn("Could not load the saved game. Starting a new game.", error)
        return createInitialPlayerState()
    }
}

export const savePlayerState = (player) => {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(player))
        return true
    } catch (error) {
        console.error("Could not save the game.", error)
        return false
    }
}
