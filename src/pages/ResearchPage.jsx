import { BookOpen } from "lucide-react"

import { Flex } from "../components/Flex"
import { Grid } from "../components/Grid"
import { Paper } from "../components/Paper"
import { Icon } from "../components/Icon"
import { Button } from "../components/Button"
import { Progress } from "../components/Progress"
import { Heading } from "../components/Heading"

import { humanize, cx } from "../utility/helpers"
import { RESEARCH_CONFIG } from "../data/researchConfig"
import { getActionXPTable } from "../data/skillConfig"
import {
    getActionDurationMs,
    getActionProgress,
    getSkillProgress,
} from "../game/gameEngine"
import { useGame } from "../hooks/useGame"
import { Badge } from "../components/Badge"

const InnerShapeMap = ["close", 3, 4, 5, 6, 7, 8, 9, 10, "star"]
const OuterRunesMap = ["dotted", "dotted", "dashed", "dashed", "gap", "gap", "wide", "wide", "solid", "solid"]

function ActionHeader({ className = "", tier, name, level }) {
    return (
        <Flex className={cx("action-header", className)}>
            <h2>{name}</h2>
            <h4 className="align-left">Lv. {level} / 100</h4>
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

function ActionProgress({ actionState, isActive, isUnlocked, onToggle, durationMs }) {
    const percentage = getActionProgress(actionState, durationMs)

    return (
        <Flex className="action-progress">
            <Progress
                corners="rounded"
                size="medium"
                layer={2}
                variant="research"
                percentage={percentage}
                animated={isActive}
            />
            <Button
                variant="research"
                className="w-20"
                size="medium"
                toggled={isActive}
                disabled={!isUnlocked || actionState.level >= 100}
                onClick={onToggle}
            >
                {!isUnlocked ? "Locked" : isActive ? "Stop" : "Research"}
            </Button>
        </Flex>
    )
}

function ActionResources({ className = "", consumes = [], produces = [] }) {
    return (
        <Flex className={cx("action-resources", className)} align="start" justify="start">
            {consumes.length > 0 && (
                <Paper layer={2}>
                    <Flex direction="column">
                        <Heading h="2">Consumes:</Heading>
                        <Flex wrap>
                            {consumes.map(item => (
                                <Paper key={item} className="w-min flex-grow" layer="3">
                                    1x {humanize(item)}
                                </Paper>
                            ))}
                        </Flex>
                    </Flex>
                </Paper>
            )}
            {produces.length > 0 && (
                <Paper layer={2}>
                    <Flex direction="column">
                        <Heading h="2">Produces:</Heading>
                        <Flex wrap>
                            {produces.map(item => (
                                <Paper key={item} className="w-min flex-grow" layer="3">
                                    1x {humanize(item)}
                                </Paper>
                            ))}
                        </Flex>
                    </Flex>
                </Paper>
            )}
        </Flex>
    )
}

function ResearchAction({ action, isActive, actionState, onToggle }) {
    const durationMs = getActionDurationMs(RESEARCH_CONFIG, action)
    const xpTable = getActionXPTable(action.id)
    const neededXP = actionState.level >= 100
        ? null
        : xpTable[actionState.level - 1].neededXP
    const produces = action.produces ?? []

    return (
        <Paper layer={1} variant="research" className="action action-research">
            <Flex direction="column">
                <Flex direction="row">
                    <Paper round layer="0" interactive className="w-min" padding={4}>
                        <Icon size={64}
                            variant="research"
                            outerRunes={OuterRunesMap[action.tier - 1]}
                            outerShape={3}
                            innerRunes={"gap"}
                            innerShape={InnerShapeMap[action.tier - 1]}
                        >
                            <BookOpen size={48} />
                        </Icon>
                    </Paper>
                    <Flex direction="column">
                        <ActionHeader
                            name={humanize(action.id)}
                            level={actionState.level}
                            tier={action.tier}
                        />
                        <ActionProgress
                            actionState={actionState}
                            isActive={isActive}
                            isUnlocked={actionState.unlocked}
                            onToggle={onToggle}
                            durationMs={durationMs}
                        />
                    </Flex>
                </Flex>
                <ActionDetails
                    actionTime={durationMs / 1000}
                    actionXP={RESEARCH_CONFIG.actionXP.base + RESEARCH_CONFIG.actionXP.perTier * (action.tier - 1)}
                    neededXP={neededXP}
                    currentXP={actionState.xp}
                />
                <ActionResources consumes={action.consumes ?? []} produces={produces} />
            </Flex>
        </Paper>
    )
}

function SkillSummary({ skillProgress }) {
    const percentage = skillProgress.maxXP > 0
        ? (skillProgress.totalXP / skillProgress.maxXP) * 100
        : 0

    return (
        <Paper className="skill-summary" layer={1} variant="research" padding={16}>
            <Flex direction="row" gap={32}>
                <Paper round layer="0" interactive className="w-min" padding={16}>
                    <Icon size={64}
                        variant="research"
                        outerRunes={"solid"}
                        outerShape={3}
                        innerRunes={"gap"}
                        innerShape={3}
                    >
                        <BookOpen size={48} />
                    </Icon>
                </Paper>
                <Flex direction="column">
                    <Flex>
                        <h1>Research</h1>
                        <h3 className="align-right">Level {skillProgress.level} / 100</h3>
                    </Flex>
                    <Flex className="skill-progress">
                        <Progress variant="research" percentage={percentage} />
                    </Flex>
                </Flex>
            </Flex>
        </Paper>
    )
}

export function ResearchPage() {
    const { player, startAction, stopAction } = useGame()
    const skillId = RESEARCH_CONFIG.id
    const skillProgress = getSkillProgress(player, skillId)

    return (
        <Flex direction="column" padding={32}>
            <Paper layer={0}>
                <SkillSummary skillProgress={skillProgress} />
            </Paper>
            <Paper layer={0}>
                <Flex direction="column" gap={32}>
                    <Grid columns={{ small: 1, medium: 2, large: 3 }}>
                        {RESEARCH_CONFIG.actions.map(action => {
                            const actionState = player.skills[skillId].actions[action.id]
                            const isActive = player.activeAction?.skillId === skillId &&
                                player.activeAction?.actionId === action.id

                            return (
                                <ResearchAction
                                    key={action.id}
                                    action={action}
                                    actionState={actionState}
                                    isActive={isActive}
                                    onToggle={() => {
                                        if (isActive) stopAction(skillId, action.id)
                                        else startAction(skillId, action.id)
                                    }}
                                />
                            )
                        })}
                    </Grid>
                </Flex>
            </Paper>
        </Flex>
    )
}
