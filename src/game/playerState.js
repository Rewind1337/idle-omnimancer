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

// Rebuild saved data from known game definitions instead of trusting arbitrary save objects.
export const normalizePlayerState = (savedState) => {
    const initial = createInitialPlayerState()
    if (!isRecord(savedState)) return initial

    const validSkillIds = new Set(SKILL_NAVIGATION.map(({ skillId }) => skillId))
    const unlockedSkillIds = new Set(initial.unlockedSkills)
    const unlockedCompanions = [...new Set(
        (Array.isArray(savedState.unlockedCompanions) ? savedState.unlockedCompanions : [])
            .filter(id => typeof id === "string" && COMPANION_IDS.includes(id))
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

    const skills = { ...initial.skills }

    for (const skill of SKILL_CONFIGS) {
        const savedSkill = getOwn(savedState.skills, skill.id)
        const savedActions = isRecord(savedSkill?.actions) ? savedSkill.actions : {}
        const actions = { ...initial.skills[skill.id].actions }

        for (const action of skill.actions) {
            const savedAction = getOwn(savedActions, action.id)
            if (!isRecord(savedAction)) continue

            const defaultAction = actions[action.id]
            const isPassiveAction =
                (action.activity ?? skill.activity ?? "active") === "passive"
            const unlocked = unlockedSkills.includes(skill.id) &&
                (savedAction.unlocked === true || defaultAction.unlocked)
            const selectedItemId = savedAction.selectedItemId
            const selectedItemData = typeof selectedItemId === "string" &&
                hasOwn(ITEM_DATA_BY_ID, selectedItemId)
                ? ITEM_DATA_BY_ID[selectedItemId]
                : null
            const selection = action.inputSelection
            const hasValidSelectedItem = selection
                ? Boolean(
                    selectedItemData &&
                    ((selection.groups ?? []).includes(selectedItemData.group) ||
                        (selection.types ?? []).includes(selectedItemData.type))
                )
                : selectedItemId == null

            actions[action.id] = {
                ...defaultAction,
                unlocked,
                level: clampInteger(savedAction.level, 1, GLOBAL_CONFIG.maxActionLevel, 1),
                xp: Math.max(0, finiteNumber(savedAction.xp, 0)),
                progressMs: Math.max(0, finiteNumber(savedAction.progressMs, 0)),
                running: isPassiveAction && unlocked && savedAction.running === true,
                selectedItemId: hasValidSelectedItem ? (selectedItemId ?? null) : null,
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

    const activeAction = isKnownAction(savedState.activeAction, unlockedSkills, skills)

    const inventory = Object.fromEntries(
        Object.entries(normalizeNumberMap(savedState.inventory))
            .filter(([itemId]) => hasOwn(ITEM_DATA_BY_ID, itemId))
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

    const savedCompanionProgress = isRecord(savedState.companionProgress)
        ? savedState.companionProgress
        : {}
    const companionProgress = Object.fromEntries(COMPANION_DATA.map(companion => {
        const savedProgress = getOwn(savedCompanionProgress, companion.id)
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
    const savedActiveSlots = isRecord(savedState.activeCompanionSlots)
        ? savedState.activeCompanionSlots
        : {}
    const savedUnlockedSlots = Array.isArray(savedState.unlockedCompanionSlots)
        ? savedState.unlockedCompanionSlots.filter(slotId => typeof slotId === "string")
        : []
    const unlockedCompanionSlots = [...new Set([
        "any",
        ...savedUnlockedSlots,
    ].filter(slotId =>
        validSlotIds.includes(slotId) && COMPANION_CONFIG.slots[slotId]
    ))]
    const assignedCompanions = new Set()
    const activeCompanionSlots = Object.fromEntries(validSlotIds.map(slotId => {
        const companionId = getOwn(savedActiveSlots, slotId) ?? null
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

    // Mission tier is derived from validated completions, never trusted as a
    // separately supplied unlock flag in the save.
    let missionTier = MISSION_DATA.startingTier

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
        lastUpdatedAt: Math.min(
            Date.now(),
            Math.max(0, finiteNumber(savedState.lastUpdatedAt, Date.now()))
        ),
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
            coins: Math.max(0, finiteNumber(getOwn(savedState.currencies, "coins"), 0)),
            fame: Math.max(0, finiteNumber(getOwn(savedState.currencies, "fame"), initial.currencies.fame)),
        },
        mana: (() => {
            const savedMana = isRecord(savedState.mana) ? savedState.mana : {}
            const max = Math.max(0, finiteNumber(savedMana.max, initial.mana.max))
            return {
                current: Math.min(max, Math.max(0, finiteNumber(savedMana.current, initial.mana.current))),
                max,
            }
        })(),
    }
}

const isRecord = value =>
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)

const hasOwn = (value, key) =>
    isRecord(value) && Object.prototype.hasOwnProperty.call(value, key)

const getOwn = (value, key) =>
    hasOwn(value, key) ? value[key] : undefined

const finiteNumber = (value, fallback) =>
    typeof value === "number" && Number.isFinite(value) ? value : fallback

const clampInteger = (value, min, max, fallback) =>
    typeof value === "number" && Number.isFinite(value)
        ? Math.min(max, Math.max(min, Math.floor(value)))
        : fallback

const normalizeNumberMap = (value) => {
    if (!isRecord(value)) return {}

    return Object.fromEntries(
        Object.entries(value)
            .filter(([, amount]) =>
                typeof amount === "number" && Number.isFinite(amount) && amount > 0
            )
    )
}

const isKnownAction = (selection, unlockedSkills, skills) => {
    if (!isRecord(selection)) return null
    const { skillId, actionId } = selection
    if (
        typeof skillId !== "string" ||
        typeof actionId !== "string" ||
        !unlockedSkills.includes(skillId) ||
        !hasOwn(SKILL_CONFIG_BY_ID, skillId)
    ) return null

    const skill = SKILL_CONFIG_BY_ID[skillId]
    const action = skill.actions.find(entry => entry.id === actionId)
    const actionState = skills[skillId]?.actions?.[actionId]
    const isPassiveAction = (action?.activity ?? skill.activity ?? "active") === "passive"
    const isMaxLevelActiveAction = action?.tracksProgress !== false &&
        actionState?.level >= GLOBAL_CONFIG.maxActionLevel

    return action && !isPassiveAction && !isMaxLevelActiveAction && actionState?.unlocked
        ? { skillId, actionId }
        : null
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
