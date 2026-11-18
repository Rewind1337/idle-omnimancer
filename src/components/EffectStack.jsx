import { Flex } from "./Flex"
import { Heading } from "./Heading"
import { Text } from "./Text"

import "./EffectStack.scss"

const EFFECT_LABELS = {
    actionTime: "action speed",
    xpGain: "action XP",
    manaCost: "Mana cost",
    itemOutput: "item output",
    preservation: "preservation chance",
    manaCapacity: "maximum Mana",
}

const formatNumber = (value) => Number(value.toFixed(2)).toString()

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
            actionTime: "action duration",
            xpGain: "action XP",
            manaCost: "Mana cost",
        }
        return "×" + formatNumber(value) + " " + (elementLabels[effect] ?? label) +
            " (" + formatPercent(value - 1) + ")"
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
}) {
    const visibleEntries = showInactive
        ? entries
        : entries.filter(entry => entry.active !== false)

    return (
        <Flex direction="column" gap={8} className="effect-stack">
            {title && <Heading h="5">{title}</Heading>}
            {visibleEntries.length > 0 ? visibleEntries.map(entry => (
                <Flex
                    key={entry.id}
                    direction="column"
                    align="stretch"
                    gap={2}
                    className="effect-stack-entry"
                    data-active={entry.active === false ? "false" : "true"}
                >
                    <Flex direction="row" justify="space-between" align="center" gap={8}>
                        <Heading h="6">{entry.title ?? entry.source}</Heading>
                        {entry.status && <Text>{entry.status}</Text>}
                    </Flex>
                    <Text>{formatEffectDescription(entry)}{entry.perStack ? " per milestone" : ""}</Text>
                    {entry.source && entry.title && <Text size="small">{entry.source}</Text>}
                    {entry.meta && <Text size="small">{entry.meta}</Text>}
                </Flex>
            )) : (
                <Text>{emptyLabel}</Text>
            )}
        </Flex>
    )
}
