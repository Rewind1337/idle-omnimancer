import { Flex } from "./Flex"
import { Heading } from "./Heading"
import { Text } from "./Text"

import "./EffectStack.scss"
import { Badge } from "./Badge"
import { formatEffectDescription, formatMultiplier, formatSigned } from "../utility/effectFormatting"

const formatSummaryValue = (value, summary) => {
    const precision = summary.precision ?? 2
    const formatted = Number(value.toFixed(precision)).toLocaleString()
    if (summary.valueFormat === "multiplier") return "x" + formatted
    return formatted + (summary.unit ? " " + summary.unit : "")
}

export function EffectStack({
    title,
    entries = [],
    showInactive = false,
    emptyLabel = "No active effects.",
    icon = null,
    summary = null,
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
            {summary && (
                <Text size="small" strong>
                    Base {summary.label}: {formatSummaryValue(summary.baseValue, summary)}
                </Text>
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
                        <Heading h="5" className="flex-grow align-right">
                            {formatEffectDescription(entry)}
                        </Heading>
                        {entry.showStacks && (
                            <Badge variant="transparent" size="small">
                                <Heading h="5" weight={400}>x{entry.stacks}</Heading>
                            </Badge>
                        )}
                        {entry.source && entry.title && (
                            <Badge variant={entry.sourceVariant ?? entry.variant ?? "transparent"} size="small">
                                <Heading h="5" weight={400}>{entry.source}</Heading>
                            </Badge>
                        )}}
                    </Flex>
                </Flex>
            )) : (
                <Text>{emptyLabel}</Text>
            )}
            {summary && (
                <>
                    <hr />
                    {summary.showCombined !== false && (
                        <Text size="small" strong>
                            Combined: {summary.combinedMode === "bonusPercent"
                                ? formatSigned(summary.combinedValue) + "%"
                                : "x" + formatMultiplier(summary.combinedMultiplier)}
                        </Text>
                    )}
                    <Text size="small" strong>
                        Final {summary.label}: {formatSummaryValue(summary.finalValue, summary)}
                    </Text>
                </>
            )}
        </Flex>
    )
}
