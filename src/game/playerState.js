import {
    GLOBAL_CONFIG,
    SKILL_CONFIGS,
    SKILL_CONFIG_BY_ID,
} from "../data/skillConfig"
import { SKILL_NAVIGATION } from "../data/navigationData"
import { ITEM_DATA_BY_ID } from "../data/itemData"
import { MISSION_DATA } from "../data/missionData"
import { COMPANION_IDS, COMPANION_DATA } from "../data/companionData"
import {
    COMPANION_CONFIG,
    COMPANION_SLOT_IDS,
    COMPANION_DEFAULT_UNLOCKED_SLOT_IDS,
    createEmptyActiveCompanionSlots,
} from "../data/companionConfig"
import { RESEARCH_BREAKTHROUGH_CONFIG } from "../data/researchBreakthroughConfig"
import { COMBAT_CONFIG, COMBAT_ACTION_BY_AREA_ID } from "../data/combatConfig"
import { SPELLCRAFT_CONFIG } from "../data/spellcraftConfig"
import { WORLD_AREA_BY_ID, WORLD_DATA } from "../data/worldData"

export const SAVE_KEY = "omnimancer-idle-save"
export const DEFAULT_INVENTORY_SLOTS = GLOBAL_CONFIG.startingBagSpace

// The save contains only serializable player data. Configurations, functions,
// generated XP tables and derived skill levels are deliberately not stored.
const createInitialCombatState = () => ({
    selectedAreaId: WORLD_DATA.map.startingAreaId,
    activeAreaId: null,
    rotation: ["omnibolt"],
    rotationSlots: COMBAT_CONFIG.player.initialRotationSlots,
    phase: "idle",
    encounter: null,
    cycleRemainingMs: 0,
    encountersCompleted: 0,
    lastRewards: [],
    pendingRewards: [],
})

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
        combat: createInitialCombatState(),
        inventory: {},
        inventorySlots: DEFAULT_INVENTORY_SLOTS,
        researchBreakthroughTier: 0,
        missionTier: MISSION_DATA.startingTier,
        completedMissions: [],
        unlockedCompanions: [],
        identifiedArtifacts: [],
        companionProgress: Object.fromEntries(COMPANION_DATA.map(companion => [
            companion.id,
            { level: 0, xp: 0 },
        ])),
        unlockedCompanionSlots: [...COMPANION_DEFAULT_UNLOCKED_SLOT_IDS],
        activeCompanionSlots: createEmptyActiveCompanionSlots(),
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

// Older saves used element/tier placeholder IDs for post-tier-4 Exploration actions.
const getLegacyExplorationActionId = action =>
    action.areaId && action.element && action.tier > 4
        ? `action:${action.element}_tier_${action.tier}`
        : null

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
            const legacyActionId = getLegacyExplorationActionId(action)
            const savedAction = getOwn(savedActions, action.id) ??
                (legacyActionId ? getOwn(savedActions, legacyActionId) : undefined)
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

    const savedCombat = isRecord(savedState.combat) ? savedState.combat : {}
    const combatSkillUnlocked = unlockedSkills.includes(COMBAT_CONFIG.id)
    const getExplorationAreaUnlocked = areaId => {
        const explorationActionId = WORLD_AREA_BY_ID[areaId]?.actionId
        return Boolean(
            explorationActionId &&
            skills["skill:exploration"]?.actions?.[explorationActionId]?.unlocked
        )
    }
    const runningCombatAction = COMBAT_CONFIG.actions.find(action =>
        skills[COMBAT_CONFIG.id]?.actions?.[action.id]?.running &&
        getExplorationAreaUnlocked(action.areaId)
    )
    const savedAreaId = COMBAT_ACTION_BY_AREA_ID[savedCombat.selectedAreaId]
        ? savedCombat.selectedAreaId
        : null
    const firstUnlockedAreaId = COMBAT_CONFIG.actions.find(action =>
        getExplorationAreaUnlocked(action.areaId)
    )?.areaId ?? WORLD_DATA.map.startingAreaId
    const selectedAreaId = savedAreaId && getExplorationAreaUnlocked(savedAreaId)
        ? savedAreaId
        : runningCombatAction?.areaId ?? firstUnlockedAreaId
    const savedActiveAreaId = COMBAT_ACTION_BY_AREA_ID[savedCombat.activeAreaId]
        ? savedCombat.activeAreaId
        : runningCombatAction?.areaId ?? (
            savedCombat.phase && savedCombat.phase !== "idle" && !Object.hasOwn(savedCombat, "activeAreaId")
                ? selectedAreaId
                : null
        )
    const activeAreaId = savedActiveAreaId && getExplorationAreaUnlocked(savedActiveAreaId)
        ? savedActiveAreaId
        : null
    const selectedCombatAction = COMBAT_ACTION_BY_AREA_ID[activeAreaId ?? selectedAreaId]
    const rotationSlots = clampInteger(
        savedCombat.rotationSlots,
        COMBAT_CONFIG.player.initialRotationSlots,
        COMBAT_CONFIG.player.maxRotationSlots,
        COMBAT_CONFIG.player.initialRotationSlots
    )
    const savedRotation = Array.isArray(savedCombat.rotation) ? savedCombat.rotation : ["omnibolt"]
    const rotation = [...new Set(savedRotation.filter(attackId =>
        attackId === "omnibolt" ||
        (typeof attackId === "string" &&
            SPELLCRAFT_CONFIG.actions.some(action =>
                action.id === attackId &&
                unlockedSkills.includes(SPELLCRAFT_CONFIG.id) &&
                skills[SPELLCRAFT_CONFIG.id]?.actions?.[attackId]?.unlocked
            ))
    ))].slice(0, rotationSlots)
    if (rotation.length === 0) rotation.push("omnibolt")

    const savedPhase = ["idle", "fighting", "rest", "inventoryFull"].includes(savedCombat.phase)
        ? savedCombat.phase
        : "idle"
    const savedEncounter = isRecord(savedCombat.encounter) ? savedCombat.encounter : null
    const expectedLineup = selectedCombatAction?.enemyLineup ?? []
    const validEnemyStates = savedEncounter &&
        Array.isArray(savedEncounter.enemies) &&
        savedEncounter.enemies.length === expectedLineup.length &&
        savedEncounter.enemies.every((enemy, index) => {
            const expectedArchetype = expectedLineup[index]?.archetype ?? "average"
            return isRecord(enemy) &&
                enemy.archetype === expectedArchetype &&
                Number.isFinite(enemy.maxHealth) && enemy.maxHealth > 0 &&
                Number.isFinite(enemy.health) && enemy.health >= 0 &&
                Number.isFinite(enemy.damage) && enemy.damage >= 0 &&
                Number.isFinite(enemy.attackIntervalMs) && enemy.attackIntervalMs > 0 &&
                Number.isFinite(enemy.attackTimerMs) && enemy.attackTimerMs >= 0
        })
    const validCombatEncounter = savedEncounter && validEnemyStates &&
        isRecord(savedEncounter.player) &&
        Number.isFinite(savedEncounter.player.maxHealth) && savedEncounter.player.maxHealth > 0 &&
        Number.isFinite(savedEncounter.player.health) && savedEncounter.player.health >= 0 &&
        Number.isFinite(savedEncounter.player.barrier) && savedEncounter.player.barrier >= 0 &&
        Number.isFinite(savedEncounter.player.attackIntervalMs) && savedEncounter.player.attackIntervalMs > 0 &&
        Number.isFinite(savedEncounter.player.attackTimerMs) && savedEncounter.player.attackTimerMs >= 0
        ? {
            enemies: savedEncounter.enemies.map((enemy, index) => {
                const archetype = COMBAT_CONFIG.enemyArchetypes[enemy.archetype]
                return {
                    ...enemy,
                    id: selectedCombatAction.id + "-enemy-" + index,
                    name: (archetype?.label ?? "Enemy") + " " + selectedCombatAction.name,
                    element: selectedCombatAction.element ?? "neutral",
                    health: Math.min(enemy.maxHealth, enemy.health),
                    attackTimerMs: Math.min(enemy.attackIntervalMs, enemy.attackTimerMs),
                }
            }),
            player: {
                ...savedEncounter.player,
                barrier: Math.min(savedEncounter.player.maxHealth * 0.49, savedEncounter.player.barrier),
                health: Math.max(
                    Math.min(savedEncounter.player.maxHealth * 0.49, savedEncounter.player.barrier),
                    Math.min(savedEncounter.player.maxHealth, savedEncounter.player.health)
                ),
                attackTimerMs: Math.min(savedEncounter.player.attackIntervalMs, savedEncounter.player.attackTimerMs),
            },
            rotationIndex: clampInteger(savedEncounter.rotationIndex, 0, rotation.length - 1, 0),
        }
        : null
    const pendingRewards = combatSkillUnlocked && Array.isArray(savedCombat.pendingRewards)
        ? savedCombat.pendingRewards.filter(reward =>
            isRecord(reward) &&
            typeof reward.item === "string" &&
            hasOwn(ITEM_DATA_BY_ID, reward.item) &&
            Number.isSafeInteger(reward.amount) &&
            reward.amount > 0
        )
        : []
    const lastRewards = combatSkillUnlocked && Array.isArray(savedCombat.lastRewards)
        ? savedCombat.lastRewards.filter(reward =>
            isRecord(reward) &&
            typeof reward.item === "string" &&
            hasOwn(ITEM_DATA_BY_ID, reward.item) &&
            Number.isSafeInteger(reward.amount) &&
            reward.amount > 0
        )
        : []
    const phase = !combatSkillUnlocked
        ? "idle"
        : pendingRewards.length > 0
            ? "inventoryFull"
            : savedPhase === "fighting" && !validCombatEncounter
                ? "idle"
                : savedPhase === "inventoryFull"
                    ? "rest"
                    : savedPhase
    const combatRunning = combatSkillUnlocked && Boolean(activeAreaId) &&
        Boolean(skills[COMBAT_CONFIG.id]?.actions?.[COMBAT_ACTION_BY_AREA_ID[activeAreaId]?.id]?.running) &&
        getExplorationAreaUnlocked(activeAreaId)
    for (const action of COMBAT_CONFIG.actions) {
        const current = skills[COMBAT_CONFIG.id]?.actions?.[action.id]
        if (current) {
            skills[COMBAT_CONFIG.id].actions[action.id] = {
                ...current,
                running: combatRunning && action.areaId === activeAreaId,
            }
        }
    }
    const combat = {
        ...createInitialCombatState(),
        selectedAreaId,
        activeAreaId,
        rotation,
        rotationSlots,
        phase,
        encounter: phase === "idle" ? null : validCombatEncounter,
        cycleRemainingMs: phase === "rest"
            ? Math.min(COMBAT_CONFIG.timing.encounterDelayMs, Math.max(0, finiteNumber(savedCombat.cycleRemainingMs, 0)))
            : 0,
        encountersCompleted: clampInteger(savedCombat.encountersCompleted, 0, Number.MAX_SAFE_INTEGER, 0),
        lastRewards,
        pendingRewards,
    }

    const activeAction = isKnownAction(savedState.activeAction, unlockedSkills, skills)

    const inventory = Object.fromEntries(
        Object.entries(normalizeNumberMap(savedState.inventory))
            .filter(([itemId]) => hasOwn(ITEM_DATA_BY_ID, itemId))
    )
    const identifiedArtifacts = [...new Set([
        ...(Array.isArray(savedState.identifiedArtifacts) ? savedState.identifiedArtifacts : [])
            .filter(itemId => ITEM_DATA_BY_ID[itemId]?.type === "artifact"),
        ...Object.entries(inventory)
            .filter(([itemId, amount]) => amount > 0 && ITEM_DATA_BY_ID[itemId]?.type === "artifact")
            .map(([itemId]) => itemId),
    ])]
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

    const validSlotIds = COMPANION_SLOT_IDS
    const savedActiveSlots = isRecord(savedState.activeCompanionSlots)
        ? savedState.activeCompanionSlots
        : {}
    const savedUnlockedSlots = Array.isArray(savedState.unlockedCompanionSlots)
        ? savedState.unlockedCompanionSlots.filter(slotId => typeof slotId === "string")
        : []
    const unlockedCompanionSlots = validSlotIds.filter(slotId =>
        COMPANION_DEFAULT_UNLOCKED_SLOT_IDS.includes(slotId) || savedUnlockedSlots.includes(slotId)
    )
    const assignedCompanions = new Set()
    const activeCompanionSlots = Object.fromEntries(validSlotIds.map(slotId => {
        const companionId = getOwn(savedActiveSlots, slotId) ?? null
        const companion = COMPANION_DATA.find(entry => entry.id === companionId)
        const slot = COMPANION_CONFIG.slotDefinitions[slotId]
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
        combat,
        inventory,
        inventorySlots,
        researchBreakthroughTier: clampInteger(
            savedState.researchBreakthroughTier,
            0,
            RESEARCH_BREAKTHROUGH_CONFIG.maxTier,
            0
        ),
        missionTier,
        completedMissions,
        unlockedCompanions,
        identifiedArtifacts,
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
    const action = skill.actions.find(entry => entry.id === actionId) ??
        skill.actions.find(entry => getLegacyExplorationActionId(entry) === actionId)
    const canonicalActionId = action?.id
    const actionState = skills[skillId]?.actions?.[canonicalActionId]
    const isPassiveAction = (action?.activity ?? skill.activity ?? "active") === "passive"
    const isMaxLevelActiveAction = action?.tracksProgress !== false &&
        actionState?.level >= GLOBAL_CONFIG.maxActionLevel

    return action && !isPassiveAction && !isMaxLevelActiveAction && actionState?.unlocked
        ? { skillId, actionId: canonicalActionId }
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

export const clearSavedPlayerState = () => {
    try {
        localStorage.removeItem(SAVE_KEY)
        return true
    } catch (error) {
        console.error("Could not clear the saved game.", error)
        return false
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
