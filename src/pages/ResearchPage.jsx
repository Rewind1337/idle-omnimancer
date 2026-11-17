import { BookOpen } from "lucide-react"
import { cloneElement } from "react"

import { Flex } from "../components/Flex"
import { Grid } from "../components/Grid"
import { Paper } from "../components/Paper"
import { Icon } from "../components/Icon"
import { Button } from "../components/Button"
import { Progress } from "../components/Progress"
import { Heading } from "../components/Heading"
import { Badge } from "../components/Badge"

import { humanize, cx } from "../utility/helpers"
import { RESEARCH_CONFIG } from "../data/researchConfig"
import { RESEARCH_ACTION_ICONS } from "../data/iconLibrary"
import { getActionXPTable } from "../data/skillConfig"
import {
    canUnlockAction,
    getActionDurationMs,
    getActionProgress,
    getSkillProgress,
    getVisibleActions,
} from "../game/gameEngine"
import { useGame } from "../hooks/useGame"

const InnerShapeMap = ["dot", 3, 4, 5, 6, 7, 8, 9, 10, "star"]
const OuterRunesMap = ["dotted", "dotted", "dashed", "dashed", "gap", "gap", "wide", "wide", "solid", "solid"]

function ActionHeader({ className = "", tier, name, level, isUnlocked }) {
    return (
        <Flex className={cx("action-header", className)}>
            <h2>{name}</h2>
            {isUnlocked && <h4 className="align-left">Lv. {level} / 100</h4>}
            <h3 className="align-right">Tier {tier} Research</h3>
        </Flex>
    )
}

function ActionDetails({ actionTime, actionXP, neededXP, currentXP }) {
    return (
        <Flex className="action-details">
            <Badge variant="transparent" interactive>{actionTime.toFixed(1)} Seconds</Badge>
            <Badge variant="transparent" interactive>{actionXP.toFixed(1)} XP / Completion</Badge>
            <Badge variant="transparent" interactive>{neededXP === null ? "MAX LEVEL" : `${currentXP.toFixed(1)} / ${neededXP} XP`}</Badge>
        </Flex>
    )
}

function ActionProgress({ actionState, isActive, onToggle, currentXP, neededXP, durationMs }) {
    const actionCompletionPercentage = getActionProgress(actionState, durationMs)
    const actionLevelPercentage = neededXP > 0 ? (currentXP / neededXP) * 100 : 100
    return (
        <Flex className="action-progress">
            <Progress corners="rounded" size="medium" layer={2} variant="research"
                percentage={actionLevelPercentage} animated={isActive} />
            <Flex direction="column" className="w-30">
                <Button variant="research" className="w-100" size="medium"
                    toggled={isActive} disabled={actionState.level >= 100} onClick={onToggle}>
                    {isActive ? "Stop" : "Research"}
                </Button>
                {isActive ? <Progress className="relative-position" corners="sharp"
                    size="small" layer={2} variant="research"
                    percentage={actionCompletionPercentage} /> : null}
            </Flex>
        </Flex>
    )
}

function ResourceSection({ title, resources }) {
    if (resources.length === 0) return null
    return (
        <Paper layer={2}>
            <Flex direction="column">
                <Heading h="2">{title}</Heading>
                <Flex wrap>
                    {resources.map(resource => {
                        const item = typeof resource === "string" ? resource : resource.item
                        const amount = typeof resource === "string" ? 1 : resource.amount
                        return <Paper key={item} className="w-min flex-grow" layer="3">{amount}x {humanize(item)}</Paper>
                    })}
                </Flex>
            </Flex>
        </Paper>
    )
}

function ActionResources({ className = "", consumes = [], produces = [], requires = [] }) {
    return (
        <Flex className={cx("action-resources", className)} align="start" justify="start">
            <ResourceSection title="Consumes:" resources={consumes} />
            <ResourceSection title="Produces:" resources={produces} />
            <ResourceSection title="Requires:" resources={requires} />
        </Flex>
    )
}

function ResearchAction({ action, isActive, isUnlocked, actionState, canUnlock, onToggle, onUnlock }) {
    const actionIcon = RESEARCH_ACTION_ICONS[action.tier - 1] ?? RESEARCH_ACTION_ICONS[0]
    const durationMs = isUnlocked ? getActionDurationMs(RESEARCH_CONFIG, action) : 0
    const xpTable = isUnlocked ? getActionXPTable(action.id) : null
    const neededXP = !isUnlocked || actionState.level >= 100 ? null : xpTable[actionState.level - 1].neededXP

    return (
        <Paper layer={1} variant="research" className="action action-research">
            <Flex direction="column">
                <Flex direction="row">
                    <Paper round layer="0" interactive className="w-min" padding={4}>
                        <Icon size={48} variant="research" outerRunes={OuterRunesMap[action.tier - 1]}
                            outerShape={3} innerRunes={"gap"} innerShape={InnerShapeMap[action.tier - 1]}>
                            {cloneElement(actionIcon, { size: 48 })}
                        </Icon>
                    </Paper>
                    <Flex direction="column">
                        <ActionHeader name={humanize(action.id)} level={actionState.level}
                            tier={action.tier} isUnlocked={isUnlocked} />
                        {isUnlocked ? (
                            <ActionProgress actionState={actionState} isActive={isActive} onToggle={onToggle}
                                durationMs={durationMs} neededXP={neededXP} currentXP={actionState.xp} />
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
                            actionXP={RESEARCH_CONFIG.actionXP.base + RESEARCH_CONFIG.actionXP.perTier * (action.tier - 1)}
                            neededXP={neededXP} currentXP={actionState.xp} />
                        <ActionResources consumes={action.consumes ?? []} produces={action.produces ?? []} />
                    </>
                ) : (
                    <ActionResources requires={action.unlockCosts ?? []} />
                )}
            </Flex>
        </Paper>
    )
}

function SkillSummary({ skillProgress, variant }) {
    const totalPercentage = skillProgress.maxXP > 0 ? (skillProgress.totalXP / skillProgress.maxXP) * 100 : 0
    const levelPercentage = skillProgress.neededXP > 0 ? (skillProgress.xp / skillProgress.neededXP) * 100 : 100
    return (
        <Paper className="skill-summary" layer={1} variant={variant} padding={16}>
            <Flex direction="row" gap={32}>
                <Paper round layer="0" interactive className="w-min" padding={16}>
                    <Icon size={64} variant={variant} outerRunes={"solid"} outerShape={3}
                        innerRunes={"gap"} innerShape={3}>
                        <BookOpen size={48} />
                    </Icon>
                </Paper>
                <Flex direction="column">
                    <Flex>
                        <h1>Research</h1>
                        <h3 className="align-right">Level {skillProgress.level} / 100</h3>
                    </Flex>
                    <Flex className="skill-progress" direction="column" gap={4}>
                        <Progress size="small" variant={variant} percentage={totalPercentage} />
                        <Progress variant={variant} percentage={levelPercentage} />
                    </Flex>
                </Flex>
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
        <Flex direction="column" padding={32}>
            <Paper layer={0}><SkillSummary skillProgress={skillProgress} variant={pageVariant} /></Paper>
            <Paper layer={0}>
                <Flex direction="column" gap={32}>
                    <Grid columns={{ small: 1, medium: 2, large: 3 }}>
                        {getVisibleActions(player, skillId).map(action => {
                            const actionState = player.skills[skillId].actions[action.id]
                            const isUnlocked = Boolean(actionState?.unlocked)
                            const isActive = player.activeAction?.skillId === skillId &&
                                player.activeAction?.actionId === action.id
                            return (
                                <ResearchAction key={action.id} action={action} actionState={actionState}
                                    isActive={isActive} isUnlocked={isUnlocked}
                                    variant={pageVariant}
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
