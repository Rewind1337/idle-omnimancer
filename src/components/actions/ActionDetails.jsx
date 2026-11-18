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
                <EffectStack title="Time effects" icon={OTHER_ICONS.HOURGLASS} entries={effectStacks.actionTime ?? []} />
                <div className="divider tooltip-divider"></div>
            </Flex>}>
                {actionTime.toFixed(2)}s
            </Badge>
            <Badge variant="transparent" interactive icon={OTHER_ICONS.SPARKLES} tooltip={<Flex direction="column" gap={8}>
                <Heading h="4" className="w-100 align-center">XP gained upon completing this action.</Heading>
                <div className="divider tooltip-divider"></div>
                <EffectStack title="XP effects" icon={OTHER_ICONS.SPARKLES} entries={effectStacks.xpGain ?? []} />
            </Flex>}>
                {actionXP.toFixed(1)} XP
            </Badge>
            {manaCost !== null && (
                <Badge variant="transparent" interactive icon={OTHER_ICONS.ZAP} tooltip={<Flex direction="column" gap={8}>
                    <Heading h="4" className="w-100 align-center">Mana consumed each time this action completes.</Heading>
                    <div className="divider tooltip-divider"></div>
                    <EffectStack title="Mana cost effects" icon={OTHER_ICONS.ZAP} entries={effectStacks.manaCost ?? []} />
                </Flex>}>
                    {manaCost.toFixed(1)} Mana
                </Badge>
            )}
            <Badge variant="transparent" interactive icon={OTHER_ICONS.FLAME} tooltip={<Flex direction="column" gap={8}>
                <Heading h="4" className="w-100 align-center">Multiplier applied to the base amount of resources produced by this action.</Heading>
                <div className="divider tooltip-divider"></div>
                <EffectStack title="Output effects" icon={OTHER_ICONS.FLAME} entries={effectStacks.itemOutput ?? []} />
            </Flex>}>
                x{outputMultiplier.toFixed(2)}
            </Badge>
            <Badge variant="transparent" interactive icon={OTHER_ICONS.RECYCLE} tooltip={<Flex direction="column" gap={8}>
                <Heading h="4" className="w-100 align-center">Chance to avoid consuming this action's required input resources when it completes.</Heading>
                <div className="divider tooltip-divider"></div>
                <EffectStack title="Preservation effects" icon={OTHER_ICONS.RECYCLE} entries={effectStacks.preservation ?? []} />
            </Flex>}>
                {(preservationChance * 100).toFixed(0)}%
            </Badge>
        </Flex>
    )
}
