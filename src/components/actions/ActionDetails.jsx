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
                <hr />
                <EffectStack title="Time effects" icon={OTHER_ICONS.HOURGLASS} entries={effectStacks.actionTime ?? []}
                    formulas={["Time = (base duration × element modifier) ÷ max(0.01, 1 + Σ multiplier bonuses + Σ flat bonuses)"]} />
            </Flex>}>
                {actionTime.toFixed(2)}s
            </Badge>
            <Badge variant="transparent" interactive icon={OTHER_ICONS.SPARKLES} tooltip={<Flex direction="column" gap={8}>
                <Heading h="4" className="w-100 align-center">XP gained upon completing this action.</Heading>
                <hr />
                <EffectStack title="XP effects" icon={OTHER_ICONS.SPARKLES} entries={effectStacks.xpGain ?? []}
                    formulas={["XP = max(0, round(base XP × element modifier × max(0, 1 + Σ multiplier bonuses) + Σ flat bonuses))"]} />
            </Flex>}>
                {actionXP.toFixed(1)} XP
            </Badge>
            {manaCost !== null && (
                <Badge variant="transparent" interactive icon={OTHER_ICONS.ZAP} tooltip={<Flex direction="column" gap={8}>
                    <Heading h="4" className="w-100 align-center">Mana consumed each time this action completes.</Heading>
                    <hr />
                    <EffectStack title="Mana cost effects" icon={OTHER_ICONS.ZAP} entries={effectStacks.manaCost ?? []}
                        formulas={["Mana = max(0, base cost × element modifier × max(0.01, 1 + Σ multiplier bonuses) − Σ flat discounts)"]} />
                </Flex>}>
                    {manaCost.toFixed(1)} Mana
                </Badge>
            )}
            <Badge variant="transparent" interactive icon={OTHER_ICONS.FLAME} tooltip={<Flex direction="column" gap={8}>
                <Heading h="4" className="w-100 align-center">Multiplier applied to the base amount of resources produced by this action.</Heading>
                <hr />
                <EffectStack title="Output effects" icon={OTHER_ICONS.FLAME} entries={effectStacks.itemOutput ?? []}
                    formulas={["Output multiplier = max(0, 1 + Σ multiplier bonuses + Σ flat bonuses)", "Output = base amount × multiplier, with fractional output rolling for +1"]} />
            </Flex>}>
                x{outputMultiplier.toFixed(2)}
            </Badge>
            {preservationChance > 0 && (
                <Badge variant="transparent" interactive icon={OTHER_ICONS.RECYCLE} tooltip={<Flex direction="column" gap={8}>
                    <Heading h="4" className="w-100 align-center">Chance to avoid consuming this action's required input resources when it completes.</Heading>
                    <hr />
                    <EffectStack title="Preservation effects" icon={OTHER_ICONS.RECYCLE} entries={effectStacks.preservation ?? []}
                        formulas={["Preservation = clamp(Σ multiplier bonus deltas + Σ flat bonuses, 0, 1)"]} />
                </Flex>}>
                    {(preservationChance * 100).toFixed(0)}%
                </Badge>
            )}
        </Flex>
    )
}
