import { Flex } from "../Flex"
import { Badge } from "../Badge"
import { OTHER_ICONS } from "../../data/iconLibrary"

export function ActionDetails({
    actionTime,
    actionXP,
    manaCost = null,
    outputMultiplier = 1,
    preservationChance = 0,
}) {
    return (
        <Flex className="action-details">
            <Badge variant="transparent" interactive icon={OTHER_ICONS.HOURGLASS} tooltip={<Flex direction="column">Time needed to complete this action.</Flex>}>
                {actionTime.toFixed(2)}s
            </Badge>
            <Badge variant="transparent" interactive icon={OTHER_ICONS.SPARKLES} tooltip={<Flex direction="column">XP gained upon completing this action.</Flex>}>
                {actionXP.toFixed(1)} XP
            </Badge>
            {manaCost !== null && (
                <Badge variant="transparent" interactive icon={OTHER_ICONS.ZAP} tooltip={<Flex direction="column">Mana required to start this action.</Flex>}>
                    {manaCost.toFixed(1)} Mana
                </Badge>
            )}
            <Badge variant="transparent" interactive icon={OTHER_ICONS.FLAME} tooltip={<Flex direction="column">Multiplier to items gained from this action.</Flex>}>
                x{outputMultiplier.toFixed(2)}
            </Badge>
            <Badge variant="transparent" interactive icon={OTHER_ICONS.RECYCLE} tooltip={<Flex direction="column">Chance to keep required resources when completing this action.</Flex>}>
                {(preservationChance * 100).toFixed(0)}%
            </Badge>
        </Flex>
    )
}
