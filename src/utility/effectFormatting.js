// Shared formatting for effect descriptions and effect-stack summaries.

const EFFECT_LABELS = {
    actionTime: "Action Speed",
    xpGain: "Action XP",
    manaCost: "Mana Cost",
    itemOutput: "Item Output",
    preservation: "Preservation Chance",
    manaCapacity: "Mana Capacity",
    manaRegeneration: "Mana Regeneration",
    sellValue: "Sell Value",
    unlockCostReduction: "Unlock Cost",
    companionChance: "Companion Chance",
    artifactChance: "Artifact Chance",
    baseGoldCost: "Gold Cost",
    companionEffect: "Companion Effect Strength",
    combatInterval: "Combat Interval",
    combatDamage: "Combat Damage",
    combatHealth: "Combat Health",
    combatShield: "Combat Shield",
}

const formatNumber = (value) => Number(value.toFixed(2)).toString()
export const formatMultiplier = (value) => Number(value.toFixed(4)).toString()

export const formatSigned = (value) =>
    (value < 0 ? "−" : "+") + formatNumber(Math.abs(value))

const formatPercent = (value) => formatSigned(value * 100) + "%"

export const formatEffectDescription = (entry) => {
    const { effect, type, value, stacks = 1, mode, perStack = false } = entry
    const multiplier = type === "mult" ? value - 1 : value
    const stackCount = perStack ? 1 : Math.max(1, stacks)
    const delta = multiplier * stackCount
    const label = EFFECT_LABELS[effect] ?? effect

    if (mode === "element") {
        const elementLabels = {
            actionTime: "Action Speed",
            xpGain: "Action XP",
            manaCost: "Mana Cost",
        }
        const elementValue = effect === "actionTime" && value > 0 ? 1 / value : value
        const elementLabel = elementLabels[effect] ?? label
        return "x" + formatNumber(elementValue) + " " + elementLabel
    }

    if (effect === "preservation") return formatPercent(delta) + " " + label
    if (effect === "unlockCostReduction") {
        return "x" + formatMultiplier(1 + delta) + " Unlock Cost"
    }
    if (effect === "baseGoldCost" && type === "flat") {
        return formatSigned(delta) + " Coins"
    }

    // Multiplier effects are shown as their resulting factor instead of a signed percentage.
    if (type === "mult" || ["actionTime", "itemOutput"].includes(effect)) {
        return "x" + formatMultiplier(1 + delta) + " " + label
    }

    if (effect === "xpGain" && type === "flat") {
        return formatSigned(delta) + " flat action XP"
    }
    if (effect === "manaCost" && type === "flat") {
        return formatSigned(-delta) + " Mana cost"
    }
    if (effect === "manaCapacity" && type === "flat") {
        return formatSigned(delta) + " maximum Mana"
    }
    if (effect === "manaRegeneration" && type === "flat") {
        return formatSigned(delta) + " Mana / second"
    }
    if (effect === "itemOutput" && type === "flat") {
        return formatSigned(delta) + "× " + label
    }

    const formatted = formatPercent(delta)

    if (effect === "actionTime") return formatted + " " + label
    if (effect === "xpGain") return formatted + " " + label
    if (effect === "manaCost") return formatted + " Mana-cost discount"
    if (effect === "itemOutput") return formatted + " " + label
    if (effect === "preservation") return formatted + " " + label
    if (effect === "manaCapacity") return formatted + " " + label

    return formatted + " " + label
}
