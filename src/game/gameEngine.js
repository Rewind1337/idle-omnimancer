import {
    GLOBAL_CONFIG,
    SKILL_CONFIG_BY_ID,
    getActionXPTable,
    getSkillXPTable,
} from "../data/skillConfig"

// Centralized action values. Later bonuses can be applied here without
// teaching UI components about progression formulas.
export const getActionDurationMs = (skill, action) => {
    const baseSeconds = skill.time.base + skill.time.perTier * (action.tier - 1)
    // Action-level speed bonuses will be applied here when those bonuses exist.
    return Math.max(1, baseSeconds * 1000)
}

export const getActionXPReward = (skill, action) =>
    skill.actionXP.base + skill.actionXP.perTier * (action.tier - 1)

export const getActionProgress = (actionState, durationMs) =>
    Math.min(100, Math.max(0, (actionState.progressMs / durationMs) * 100))

export const getSkillProgress = (player, skillId) => {
    const skill = SKILL_CONFIG_BY_ID[skillId]
    const table = getSkillXPTable(skillId)
    if (!skill || !table) return null

    // Skill XP intentionally comes from completed action levels only. Partial
    // action XP does not contribute until that action actually levels up.
    const totalXP = skill.actions.reduce((total, action) => {
        const level = player.skills[skillId]?.actions[action.id]?.level ?? 1
        return total + (level - 1)
    }, 0)

    let current = table[0]
    for (const entry of table) {
        if (entry.totalXP > totalXP) break
        current = entry
    }

    return {
        level: current.level,
        xp: totalXP - current.totalXP,
        neededXP: current.neededXP,
        totalXP,
        maxXP: table[table.length - 1].totalXP,
    }
}

const canPayActionCost = (player, action, actionState) =>
    Boolean(actionState?.cycleStarted) ||
    !action.manaCost ||
    player.mana.current >= action.manaCost

const payActionCost = (player, action) => {
    if (action.manaCost) {
        player.mana.current = Math.max(0, player.mana.current - action.manaCost)
    }
}

// Start a fresh action cycle, paying its cost once. If a cost cannot be paid,
// the action remains selected/running but waits for the required resource.
const startCycle = (player, actionState, action) => {
    if (actionState.cycleStarted) return true
    if (!canPayActionCost(player, action, actionState)) return false

    payActionCost(player, action)
    actionState.cycleStarted = true
    return true
}

const awardActionXP = (player, skill, action, actionState) => {
    actionState.xp += getActionXPReward(skill, action)

    const table = getActionXPTable(action.id)
    while (
        actionState.level < GLOBAL_CONFIG.maxActionLevel &&
        actionState.xp >= table[actionState.level - 1].neededXP
    ) {
        actionState.xp -= table[actionState.level - 1].neededXP
        actionState.level += 1
    }

    if (actionState.level >= GLOBAL_CONFIG.maxActionLevel) {
        actionState.level = GLOBAL_CONFIG.maxActionLevel
        actionState.xp = 0
    }

    // Current action configs use either "produces" or "outputItem".
    // Keep this compatibility layer here so configs can be standardized later.
    const outputs = action.produces ?? action.outputItem ?? []
    for (const itemId of outputs) {
        player.inventory[itemId] = (player.inventory[itemId] ?? 0) + 1
    }
}

// Advance one running action by elapsed milliseconds. The while loop handles
// delayed browser ticks and offline time that span multiple action completions.
const advanceOneAction = (player, skill, action, actionState, deltaMs, isActive) => {
    let remainingMs = deltaMs
    let changed = false

    while (remainingMs > 0 && actionState.level < GLOBAL_CONFIG.maxActionLevel) {
        if (!startCycle(player, actionState, action)) break

        const durationMs = getActionDurationMs(skill, action)
        const timeLeft = Math.max(0, durationMs - actionState.progressMs)
        const consumedMs = Math.min(remainingMs, timeLeft)

        actionState.progressMs += consumedMs
        remainingMs -= consumedMs
        changed = changed || consumedMs > 0

        if (actionState.progressMs + 0.0001 < durationMs) break

        actionState.progressMs = 0
        actionState.cycleStarted = false
        awardActionXP(player, skill, action, actionState)
        changed = true
    }

    if (actionState.level >= GLOBAL_CONFIG.maxActionLevel) {
        actionState.progressMs = 0
        actionState.cycleStarted = false
        if (!isActive) actionState.running = false
    }

    return changed
}

// Advance all eligible systems by the actual elapsed time. Passive regeneration
// runs independently of the selected active action (e.g. Spellcraft Mana).
export const advanceGame = (playerState, deltaMs, now = Date.now()) => {
    if (!Number.isFinite(deltaMs) || deltaMs <= 0) {
        return { ...playerState, lastUpdatedAt: now }
    }

    const player = structuredClone(playerState)

    // Passive resource regeneration is independent of active action selection.
    const spellcraft = SKILL_CONFIG_BY_ID["skill:spellcraft"]
    if (spellcraft?.mana?.regen) {
        player.mana.current = Math.min(
            player.mana.max,
            player.mana.current + spellcraft.mana.regen * (deltaMs / 1000)
        )
    }

    // The game currently permits one selected active action globally.
    if (player.activeAction) {
        const { skillId, actionId } = player.activeAction
        const skill = SKILL_CONFIG_BY_ID[skillId]
        const action = skill?.actions.find(entry => entry.id === actionId)
        const actionState = player.skills[skillId]?.actions[actionId]

        if (skill && action && actionState?.unlocked) {
            const activity = action.activity ?? skill.activity ?? "active"
            if (activity === "active") {
                advanceOneAction(player, skill, action, actionState, deltaMs, true)

                // An action at its maximum level no longer occupies the active
                // slot. The player can select another action immediately.
                if (actionState.level >= GLOBAL_CONFIG.maxActionLevel) {
                    player.activeAction = null
                }
            }
        }
    }

    // Passive actions are opt-in and run independently of the active slot.
    for (const skill of Object.values(SKILL_CONFIG_BY_ID)) {
        for (const action of skill.actions) {
            const activity = action.activity ?? skill.activity ?? "active"
            if (activity !== "passive") continue

            const actionState = player.skills[skill.id]?.actions[action.id]
            if (!actionState?.unlocked || !actionState.running) continue

            advanceOneAction(player, skill, action, actionState, deltaMs, false)
        }
    }

    player.lastUpdatedAt = now
    return player
}

// Pure helpers used by the reducer when a player starts/stops activities.
export const canStartAction = (player, skillId, actionId) => {
    const skill = SKILL_CONFIG_BY_ID[skillId]
    const action = skill?.actions.find(entry => entry.id === actionId)
    const state = player.skills[skillId]?.actions[actionId]

    if (!skill || !action || !state?.unlocked || state.level >= GLOBAL_CONFIG.maxActionLevel) {
        return false
    }

    return canPayActionCost(player, action, state)
}

export const getActionActivity = (skillId, actionId) => {
    const skill = SKILL_CONFIG_BY_ID[skillId]
    const action = skill?.actions.find(entry => entry.id === actionId)
    return action?.activity ?? skill?.activity ?? "active"
}
