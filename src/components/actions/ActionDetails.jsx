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
            <Badge variant="transparent" interactive icon={OTHER_ICONS.HOURGLASS}>
                {actionTime.toFixed(1)} Seconds
            </Badge>
            <Badge variant="transparent" interactive icon={OTHER_ICONS.SPARKLES}>
                {actionXP.toFixed(1)} XP / Completion
            </Badge>
            {manaCost !== null && (
                <Badge variant="transparent" interactive>
                    {manaCost.toLocaleString()} Mana / Cast
                </Badge>
            )}
            <Badge variant="transparent" interactive icon={OTHER_ICONS.FLAME}>
                {outputMultiplier.toFixed(1)}x Output
            </Badge>
            <Badge variant="transparent" interactive icon={OTHER_ICONS.RECYCLE}>
                {(preservationChance * 100).toFixed(0)}% Preservation
            </Badge>
        </Flex>
    )
}
