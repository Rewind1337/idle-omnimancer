import { cloneElement } from "react"

import { Flex } from "../components/Flex"
import { Grid } from "../components/Grid"
import { Paper } from "../components/Paper"
import { Icon } from "../components/Icon"
import { Button } from "../components/Button"
import { SkillSummary } from "../components/skills/SkillSummary"
import { ActionHeader } from "../components/actions/ActionHeader"
import { ActionDetails } from "../components/actions/ActionDetails"
import { ActionProgress } from "../components/actions/ActionProgress"
import { ActionResources } from "../components/actions/ActionResources"

import { humanize } from "../utility/helpers"
import { RESEARCH_CONFIG } from "../data/researchConfig"
import { RESEARCH_ACTION_ICONS, SKILL_ICONS } from "../data/iconLibrary"
import { getActionXPTable } from "../data/skillConfig"
import {
    canUnlockAction,
    getActionDurationMs,
    getActionXPReward,
    getActionOutputMultiplier,
    getActionPreservationChance,
    getSkillProgress,
    getVisibleActions,
} from "../game/gameEngine"
import { useGame } from "../hooks/useGame"
import { CopyX } from "lucide-react"

const InnerShapeMap = ["dot", 3, 4, 5, 6, 7, 8, 9, 10, "star"]
const OuterRunesMap = ["dotted", "dotted", "dashed", "dashed", "gap", "gap", "wide", "wide", "solid", "solid"]

function ResearchAction({ action, player, isActive, isUnlocked, actionState, canUnlock, onToggle, onUnlock }) {
    const actionIcon = RESEARCH_ACTION_ICONS[action.tier - 1] ?? RESEARCH_ACTION_ICONS[0]
    const durationMs = isUnlocked ? getActionDurationMs(RESEARCH_CONFIG, action, player) : 0
    const xpTable = isUnlocked ? getActionXPTable(action.id) : null
    const neededXP = !isUnlocked || actionState.level >= 100
        ? null
        : xpTable[actionState.level - 1].neededXP

    return (
        <Paper layer={1} variant="research" className="action action-research">
            <Flex direction="column">
                <Flex direction="row">
                    <Paper round layer="0" interactive className="w-min" padding={4}>
                        <Icon size={48} variant="research" outerRunes={OuterRunesMap[action.tier - 1]}
                            outerShape={7} innerRunes="gap" innerShape={InnerShapeMap[action.tier - 1]}>
                            {cloneElement(actionIcon, { size: 48 })}
                        </Icon>
                    </Paper>
                    <Flex direction="column">
                        <ActionHeader name={humanize(action.id)} level={actionState.level}
                            currentXP={actionState.xp} neededXP={neededXP}
                            tier={action.tier} isUnlocked={isUnlocked} />
                        {isUnlocked ? (
                            <ActionProgress actionState={actionState} isActive={isActive} onToggle={onToggle}
                                durationMs={durationMs} neededXP={neededXP} currentXP={actionState.xp}
                                variant="research" actionLabel="Research" />
                        ) : (
                            <Button variant="research" className="w-100" size="medium"
                                disabled={!canUnlock} onClick={onUnlock}>
                                Unlock
                            </Button>
                        )}
                    </Flex>
                </Flex>
                {isUnlocked ? (
                    <>
                        <ActionDetails actionTime={durationMs / 1000}
                            actionXP={getActionXPReward(RESEARCH_CONFIG, action, player)}
                            outputMultiplier={getActionOutputMultiplier(player, RESEARCH_CONFIG, action)}
                            preservationChance={getActionPreservationChance(player, RESEARCH_CONFIG, action)} />
                        <ActionResources consumes={action.consumes ?? []} produces={action.produces ?? []} />
                    </>
                ) : (
                    <ActionResources requires={action.unlockCosts ?? []} />
                )}
            </Flex>
        </Paper>
    )
}

export function ResearchPage() {
    const { player, startAction, stopAction, unlockAction } = useGame()
    const skillId = RESEARCH_CONFIG.id
    const pageVariant = "research"
    const skillProgress = getSkillProgress(player, skillId)

    return (
        <Flex direction="column" className={CopyX("page-flex page-flex-research")} padding={32} gap={32}>
            <Paper layer={0}>
                <SkillSummary
                    title={humanize(RESEARCH_CONFIG.id)}
                    skillProgress={skillProgress}
                    variant={pageVariant}
                    icon={
                        <Icon
                            size={64} variant={pageVariant} outerRunes="solid" outerShape={7}
                            innerRunes="gap" innerShape="3">
                            {cloneElement(SKILL_ICONS.RESEARCH, { size: 48 })}
                        </Icon>
                    }
                />
            </Paper>
            <Paper layer={0}>
                <Flex direction="column" gap={32}>
                    <Grid columns={1}>
                        {getVisibleActions(player, skillId).map(action => {
                            const actionState = player.skills[skillId].actions[action.id]
                            const isUnlocked = Boolean(actionState?.unlocked)
                            const isActive = player.activeAction?.skillId === skillId &&
                                player.activeAction?.actionId === action.id

                            return (
                                <ResearchAction key={action.id} action={action} player={player} actionState={actionState}
                                    isActive={isActive} isUnlocked={isUnlocked}
                                    canUnlock={canUnlockAction(player, skillId, action.id)}
                                    onUnlock={() => unlockAction(skillId, action.id)}
                                    onToggle={() => {
                                        if (isActive) stopAction(skillId, action.id)
                                        else startAction(skillId, action.id)
                                    }} />
                            )
                        })}
                    </Grid>
                </Flex>
            </Paper>
        </Flex>
    )
}
