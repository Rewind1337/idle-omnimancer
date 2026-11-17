import { Flex } from "../Flex"
import { Button } from "../Button"
import { Progress } from "../Progress"
import { getActionProgress } from "../../game/gameEngine"

export function ActionProgress({
    actionState,
    isActive,
    onToggle,
    currentXP,
    neededXP,
    durationMs,
    variant = "research",
    actionLabel = "Research",
}) {
    const actionCompletionPercentage = getActionProgress(actionState, durationMs)
    const actionLevelPercentage = neededXP > 0 ? (currentXP / neededXP) * 100 : 100

    return (
        <Flex className="action-progress">
            <Progress corners="rounded" size="medium" layer={2} variant={variant}
                percentage={actionLevelPercentage} animated={isActive} />
            <Flex direction="column" className="w-30">
                <Button variant={variant} className="w-100" size="medium"
                    toggled={isActive} disabled={actionState.level >= 100} onClick={onToggle}>
                    {isActive ? "Stop" : actionLabel}
                </Button>
                {isActive ? (
                    <Progress className="relative-position" corners="sharp"
                        size="small" layer={2} variant={variant}
                        percentage={actionCompletionPercentage} />
                ) : null}
            </Flex>
        </Flex>
    )
}
