import { Flex } from "../Flex"
import { Badge } from "../Badge"
import { OTHER_ICONS } from "../../data/iconLibrary"
import { EffectStack } from "../EffectStack"
import { Heading } from "../Heading"

export function ActionDetails({
    actionTime,
    actionXP,
    manaCost = null,
    outputMultiplier = 1,
    preservationChance = 0,
    effectStacks = {},
}) {
    return (
        <Flex className="action-details">
            <Badge variant="transparent" interactive icon={OTHER_ICONS.HOURGLASS} tooltip={<Flex direction="column" gap={8}>
                <Heading h="4" className="w-100 align-center">Time needed to complete this action.</Heading>
                <div className="divider tooltip-divider"></div>
                <EffectStack title="Time effects" icon={OTHER_ICONS.HOURGLASS} entries={effectStacks.actionTime ?? []}
                    formula="Time = (base duration × element modifier) ÷ max(0.01, 1 + Σ speed bonuses)" />
            </Flex>}>
                {actionTime.toFixed(2)}s
            </Badge>
            <Badge variant="transparent" interactive icon={OTHER_ICONS.SPARKLES} tooltip={<Flex direction="column" gap={8}>
                <Heading h="4" className="w-100 align-center">XP gained upon completing this action.</Heading>
                <div className="divider tooltip-divider"></div>
                <EffectStack title="XP effects" icon={OTHER_ICONS.SPARKLES} entries={effectStacks.xpGain ?? []}
                    formula="XP = round(max(0, base XP × element modifier × (1 + Σ multipliers) + Σ flat bonuses))" />
            </Flex>}>
                {actionXP.toFixed(1)} XP
            </Badge>
            {manaCost !== null && (
                <Badge variant="transparent" interactive icon={OTHER_ICONS.ZAP} tooltip={<Flex direction="column" gap={8}>
                    <Heading h="4" className="w-100 align-center">Mana consumed each time this action completes.</Heading>
                    <div className="divider tooltip-divider"></div>
                    <EffectStack title="Mana cost effects" icon={OTHER_ICONS.ZAP} entries={effectStacks.manaCost ?? []}
                        formula="Mana = max(0, base cost × element modifier × (1 + Σ multipliers) − Σ flat discounts)" />
                </Flex>}>
                    {manaCost.toFixed(1)} Mana
                </Badge>
            )}
            <Badge variant="transparent" interactive icon={OTHER_ICONS.FLAME} tooltip={<Flex direction="column" gap={8}>
                <Heading h="4" className="w-100 align-center">Multiplier applied to the base amount of resources produced by this action.</Heading>
                <div className="divider tooltip-divider"></div>
                <EffectStack title="Output effects" icon={OTHER_ICONS.FLAME} entries={effectStacks.itemOutput ?? []}
                    formula="Output = base amount × max(0, 1 + Σ multipliers + Σ flat bonuses); fractional output rolls for +1" />
            </Flex>}>
                x{outputMultiplier.toFixed(2)}
            </Badge>
            {preservationChance > 0 && (
                <Badge variant="transparent" interactive icon={OTHER_ICONS.RECYCLE} tooltip={<Flex direction="column" gap={8}>
                    <Heading h="4" className="w-100 align-center">Chance to avoid consuming this action's required input resources when it completes.</Heading>
                    <div className="divider tooltip-divider"></div>
                    <EffectStack title="Preservation effects" icon={OTHER_ICONS.RECYCLE} entries={effectStacks.preservation ?? []}
                        formula="Preservation = clamp(Σ flat and multiplier bonuses, 0%, 100%)" />
                </Flex>}>
                    {(preservationChance * 100).toFixed(0)}%
                </Badge>
            )}
        </Flex>
    )
}
