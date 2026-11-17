import { Flex } from "../Flex"
import { Badge } from "../Badge"

export function ActionDetails({ actionTime, actionXP, neededXP, currentXP, manaCost = null }) {
    return (
        <Flex className="action-details">
            <Badge variant="transparent" interactive>{actionTime.toFixed(1)} Seconds</Badge>
            <Badge variant="transparent" interactive>{actionXP.toFixed(1)} XP / Completion</Badge>
            {manaCost !== null && (
                <Badge variant="transparent" interactive>{manaCost.toLocaleString()} Mana / Cast</Badge>
            )}
            <Badge variant="transparent" interactive>
                {neededXP === null ? "MAX LEVEL" : `${currentXP.toFixed(1)} / ${neededXP} XP`}
            </Badge>
        </Flex>
    )
}
