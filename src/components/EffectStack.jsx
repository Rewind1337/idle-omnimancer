import { Flex } from "./Flex"
import { Heading } from "./Heading"
import { Text } from "./Text"

import "./EffectStack.scss"
import { Badge } from "./Badge"

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
}

const formatNumber = (value) => Number(value.toFixed(2)).toString()
const formatMultiplier = (value) => Number(value.toFixed(4)).toString()

const formatSigned = (value) =>
    (value < 0 ? "−" : "+") + formatNumber(Math.abs(value))

const formatPercent = (value) => formatSigned(value * 100) + "%"

const formatEffectDescription = (entry) => {
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

    // Multiplier effects are shown as their resulting factor instead of a signed percentage.
    if (type === "mult" || ["actionTime", "itemOutput", "preservation"].includes(effect)) {
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

export function EffectStack({
    title,
    entries = [],
    showInactive = false,
    emptyLabel = "No active effects.",
    icon = null,
    formulas = [],
}) {
    const visibleEntries = showInactive
        ? entries
        : entries.filter(entry => entry.active !== false)

    return (
        <Flex direction="column" gap={8} className="effect-stack">
            {title && (
                <Flex direction="row" align="center" justify="center" gap={6} className="effect-stack-title">
                    {icon && <span className="w-0 align-right effect-stack-title-icon">{icon}</span>}
                    <Heading h="4" className="w-100 flex-grow align-center">{title}</Heading>
                    {icon && <span className="w-0 align-left effect-stack-title-icon">{icon}</span>}
                </Flex>
            )}
            {visibleEntries.length > 0 ? visibleEntries.map(entry => (
                <Flex
                    key={entry.id}
                    direction="column"
                    align="start"
                    gap={2}
                    className="effect-stack-entry"
                    data-active={entry.active === false ? "false" : "true"}
                >
                    <Flex direction="row" justify="start" align="center" gap={8}>
                        <Badge variant={entry.variant} size="small">
                            <Heading h="5" weight={400}>{entry.title ?? entry.source}</Heading>
                        </Badge>
                        <Heading h="5" className="w-60 flex-grow">
                            {formatEffectDescription(entry)}
                        </Heading>
                        <Heading h="5" className="w-40 align-right">
                            {entry.showStacks ? "x" + entry.stacks : ""}
                            {entry.source && entry.title && entry.source}
                        </Heading>
                    </Flex>
                </Flex>
            )) : (
                <Text>{emptyLabel}</Text>
            )}
            {formulas.length > 0 && <hr />}
            {formulas.length > 0 && formulas.map((formula, index) => (
                <Text key={formula + "-" + index} size="small">{formula}</Text>
            ))}
        </Flex>
    )
}
