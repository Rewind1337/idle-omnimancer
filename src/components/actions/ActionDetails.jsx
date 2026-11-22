import { Flex } from "../Flex"
import { Badge } from "../Badge"
import { OTHER_ICONS } from "../../data/iconLibrary"
import { EffectStack } from "../EffectStack"
import { Heading } from "../Heading"
import { getActionEffectSummary } from "../../game/gameEngine"

export function ActionDetails({
    actionTime,
    actionXP,
    manaCost = null,
    outputMultiplier = 1,
    itemValue = null,
    preservationChance = 0,
    effectStacks = {},
    player,
    skill,
    action,
}) {
    return (
        <Flex className="action-details">
            <Badge variant="transparent" interactive icon={OTHER_ICONS.HOURGLASS} tooltip={<Flex direction="column" gap={8}>
                <Heading h="4" className="w-100 align-center">Time needed to complete this action.</Heading>
                <hr />
                <EffectStack title="Time effects" icon={OTHER_ICONS.HOURGLASS} entries={effectStacks.actionTime ?? []}
                    summary={getActionEffectSummary(player, skill, action, "actionTime")} />
            </Flex>}>
                {actionTime.toFixed(2)}s
            </Badge>
            <Badge variant="transparent" interactive icon={OTHER_ICONS.SPARKLES} tooltip={<Flex direction="column" gap={8}>
                <Heading h="4" className="w-100 align-center">XP gained upon completing this action.</Heading>
                <hr />
                <EffectStack title="XP effects" icon={OTHER_ICONS.SPARKLES} entries={effectStacks.xpGain ?? []}
                    summary={getActionEffectSummary(player, skill, action, "xpGain")} />
            </Flex>}>
                {actionXP.toFixed(1)} XP
            </Badge>
            {manaCost !== null && (
                <Badge variant="transparent" interactive icon={OTHER_ICONS.ZAP} tooltip={<Flex direction="column" gap={8}>
                    <Heading h="4" className="w-100 align-center">Mana consumed each time this action completes.</Heading>
                    <hr />
                    <EffectStack title="Mana cost effects" icon={OTHER_ICONS.ZAP} entries={effectStacks.manaCost ?? []}
                        summary={getActionEffectSummary(player, skill, action, "manaCost")} />
                </Flex>}>
                    {manaCost.toFixed(1)} Mana
                </Badge>
            )}
            {Number.isFinite(itemValue) && (
                <Badge variant="transparent" interactive icon={OTHER_ICONS.COINS}
                    tooltip={<Flex direction="column" gap={8}>
                        <Heading h="4" className="w-100 align-center">Current selected item's sale value.</Heading>
                    </Flex>}>
                    {itemValue.toLocaleString()} coins
                </Badge>
            )}
            <Badge variant="transparent" interactive icon={OTHER_ICONS.FLAME} tooltip={<Flex direction="column" gap={8}>
                <Heading h="4" className="w-100 align-center">Multiplier applied to the base amount of resources produced by this action.</Heading>
                <hr />
                <EffectStack title="Output effects" icon={OTHER_ICONS.FLAME} entries={effectStacks.itemOutput ?? []}
                    summary={getActionEffectSummary(player, skill, action, "itemOutput")} />
            </Flex>}>
                x{outputMultiplier.toFixed(2)}
            </Badge>
            {preservationChance > 0 && (
                <Badge variant="transparent" interactive icon={OTHER_ICONS.RECYCLE} tooltip={<Flex direction="column" gap={8}>
                    <Heading h="4" className="w-100 align-center">Chance to avoid consuming this action's required input resources when it completes.</Heading>
                    <hr />
                    <EffectStack title="Preservation effects" icon={OTHER_ICONS.RECYCLE} entries={effectStacks.preservation ?? []}
                        summary={getActionEffectSummary(player, skill, action, "preservation")} />
                </Flex>}>
                    {(preservationChance * 100).toFixed(0)}%
                </Badge>
            )}
        </Flex>
    )
}
