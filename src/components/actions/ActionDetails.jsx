import { Flex } from "../Flex"
import { Badge } from "../Badge"
import { OTHER_ICONS } from "../../data/iconLibrary"
import { EffectStack } from "../EffectStack"

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
            <Badge variant="transparent" interactive icon={OTHER_ICONS.HOURGLASS} tooltip={<EffectStack title="Active time effects" entries={effectStacks.actionTime ?? []} />}>
                {actionTime.toFixed(2)}s
            </Badge>
            <Badge variant="transparent" interactive icon={OTHER_ICONS.SPARKLES} tooltip={<EffectStack title="Active XP effects" entries={effectStacks.xpGain ?? []} />}>
                {actionXP.toFixed(1)} XP
            </Badge>
            {manaCost !== null && (
                <Badge variant="transparent" interactive icon={OTHER_ICONS.ZAP} tooltip={<EffectStack title="Active Mana-cost effects" entries={effectStacks.manaCost ?? []} />}>
                    {manaCost.toFixed(1)} Mana
                </Badge>
            )}
            <Badge variant="transparent" interactive icon={OTHER_ICONS.FLAME} tooltip={<EffectStack title="Active output effects" entries={effectStacks.itemOutput ?? []} />}>
                x{outputMultiplier.toFixed(2)}
            </Badge>
            <Badge variant="transparent" interactive icon={OTHER_ICONS.RECYCLE} tooltip={<EffectStack title="Active preservation effects" entries={effectStacks.preservation ?? []} />}>
                {(preservationChance * 100).toFixed(0)}%
            </Badge>
        </Flex>
    )
}
