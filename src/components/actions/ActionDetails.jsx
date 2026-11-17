import { Flex } from "../Flex"
import { Badge } from "../Badge"

export function ActionDetails({ actionTime, actionXP, neededXP, currentXP }) {
    return (
        <Flex className="action-details">
            <Badge variant="transparent" interactive>{actionTime.toFixed(1)} Seconds</Badge>
            <Badge variant="transparent" interactive>{actionXP.toFixed(1)} XP / Completion</Badge>
            <Badge variant="transparent" interactive>
                {neededXP === null ? "MAX LEVEL" : `${currentXP.toFixed(1)} / ${neededXP} XP`}
            </Badge>
        </Flex>
    )
}
