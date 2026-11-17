import {
    GLOBAL_CONFIG,
    SKILL_CONFIGS,
    SKILL_CONFIG_BY_ID,
} from "../data/skillConfig"
import { SKILL_NAVIGATION } from "../data/navigationData"

export const SAVE_KEY = "omnimancer-idle-save"
export const SAVE_VERSION = 3

// The save contains only serializable player data. Configurations, functions,
// generated XP tables and derived skill levels are deliberately not stored.
export const createInitialPlayerState = () => {
    const skills = Object.fromEntries(
        SKILL_CONFIGS.map(skill => [
            skill.id,
            {
                actions: Object.fromEntries(
                    skill.actions.map(action => [
                        action.id,
                        {
                            unlocked: Boolean(action.unlockedByDefault),
                            level: 1,
                            xp: 0,
                            progressMs: 0,
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

    const defaultUnlockedSkills = new Set(
        SKILL_CONFIGS
            .filter(skill => skill.unlockedByDefault)
            .map(skill => skill.id)
    )

    return {
        version: SAVE_VERSION,
        lastUpdatedAt: Date.now(),
        unlockedSkills: SKILL_NAVIGATION
            .filter(({ skillId }) => defaultUnlockedSkills.has(skillId))
            .map(({ skillId }) => skillId),
        activeAction: null,
        skills,
        inventory: {},
        currencies: {
            gold: 0,
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
            const preserveProgress = savedState.version >= SAVE_VERSION ||
                isActiveAction ||
                isRunningPassiveAction

            actions[action.id] = {
                ...defaultAction,
                unlocked: Boolean(savedAction.unlocked) || defaultAction.unlocked,
                level: clampInteger(savedAction.level, 1, GLOBAL_CONFIG.maxActionLevel, 1),
                xp: Math.max(0, finiteNumber(savedAction.xp, 0)),
                progressMs: preserveProgress
                    ? Math.max(0, finiteNumber(savedAction.progressMs, 0))
                    : 0,
                running: unlockedSkills.includes(skill.id) && Boolean(savedAction.running),
            }
        }

        skills[skill.id] = { actions }
    }

    return {
        ...initial,
        version: SAVE_VERSION,
        lastUpdatedAt: Math.max(0, finiteNumber(savedState.lastUpdatedAt, Date.now())),
        unlockedSkills,
        activeAction,
        skills,
        inventory: normalizeNumberMap(savedState.inventory),
        currencies: {
            gold: Math.max(0, finiteNumber(savedState.currencies?.gold, 0)),
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
