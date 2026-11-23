import { Flex } from "../Flex"
import { Button } from "../Button"
import { Progress } from "../Progress"
import { getActionProgress } from "../../game/gameEngine"
import { useGameActionCanStart, useGameActionProgress } from "../../hooks/useGame"
import { SKILL_ICONS } from "../../data/iconLibrary"

export function ActionProgress({
    skillId,
    actionId,
    isActive,
    onToggle,
    currentXP,
    neededXP,
    durationMs,
    variant = "research",
    actionLabel = "Research",
    canStart = true,
    leadingControl = null,
}) {
    const actionIcon = SKILL_ICONS[skillId.replace(/^skill:/, "").toUpperCase()] ?? null
    const actionProgress = useGameActionProgress(skillId, actionId)
    const canStartAction = useGameActionCanStart(skillId, actionId, canStart)
    const actionCompletionPercentage = getActionProgress(actionProgress, durationMs)
    const actionLevelPercentage = neededXP > 0 ? (currentXP / neededXP) * 100 : 100

    return (
        <Flex className={leadingControl ? "action-progress action-progress-with-leading-control" : "action-progress"}>
            {leadingControl}
            <Progress className={leadingControl ? "action-progress-bar" : ""}
                corners="rounded" size="medium" layer={2} variant={variant}
                percentage={actionLevelPercentage} animated={isActive} />
            <Flex direction="column" className={leadingControl ? "w-30 action-progress-toggle" : "w-30"}>
                <Button variant={variant} className="w-100" size="medium" icon={actionIcon}
                    disabled={!isActive && !canStartAction}
                    toggled={isActive} onClick={onToggle}
                    badge={isActive ? actionCompletionPercentage.toFixed(0) + "%" : null}>
                    {isActive ? "Stop" : actionLabel}
                </Button>
            </Flex>
        </Flex>
    )
}
