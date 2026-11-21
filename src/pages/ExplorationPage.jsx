import { cloneElement, useState } from "react"

import { Flex } from "../components/Flex"
import { Heading } from "../components/Heading"
import { Icon } from "../components/Icon"
import { Paper } from "../components/Paper"
import { HexMap } from "../components/maps/HexMap"
import { SkillSummary } from "../components/skills/SkillSummary"
import { ActionHeader } from "../components/actions/ActionHeader"
import { ActionDetails } from "../components/actions/ActionDetails"
import { ActionProgress } from "../components/actions/ActionProgress"
import { ActionResources } from "../components/actions/ActionResources"
import { Button } from "../components/Button"

import { EXPLORATION_CONFIG } from "../data/explorationConfig"
import { WORLD_AREAS, WORLD_AREA_BY_ID, WORLD_DATA } from "../data/worldData"
import { SKILL_ICONS } from "../data/iconLibrary"
import { getActionXPTable } from "../data/skillConfig"
import {
    canUnlockAction,
    canStartAction,
    getActionDurationMs,
    getActionXPReward,
    getActionEffectStacks,
    getActionMilestoneDetails,
    getActionOutputMultiplier,
    getActionPreservationChance,
    getSkillProgress,
    getSkillMilestoneDetails,
} from "../game/gameEngine"
import { useGame } from "../hooks/useGame"
import { humanize } from "../utility/helpers"

import "./ExplorationPage.scss"

const INNER_SHAPES = [3, 4, 5, 6, 7, 8, 9, 10]
const OUTER_RUNES = ["dotted", "dotted", "dashed", "dashed", "gap", "gap", "wide", "wide"]

function ExplorationActionCard({
    action,
    player,
    actionState,
    isUnlocked,
    isActive,
    canUnlock,
    canStart,
    onToggle,
    onUnlock,
}) {
    const elementVariant = action.element ?? "exploration"
    const durationMs = isUnlocked ? getActionDurationMs(EXPLORATION_CONFIG, action, player) : 0
    const actionXPTable = isUnlocked ? getActionXPTable(action.id) : null
    const neededXP = !isUnlocked || actionState.level >= 100
        ? null
        : actionXPTable?.[actionState.level - 1]?.neededXP ?? null
    const actionMilestones = isUnlocked
        ? getActionMilestoneDetails(player, EXPLORATION_CONFIG, action)
        : []
    const effectStacks = isUnlocked
        ? getActionEffectStacks(player, EXPLORATION_CONFIG, action)
        : {}
    const outputMultiplier = isUnlocked
        ? getActionOutputMultiplier(player, EXPLORATION_CONFIG, action)
        : 1

    return (
        <Paper layer={1} variant={elementVariant} className="action action-exploration">
            <Flex direction="column">
                <Flex direction="row">
                    <Paper round layer="0" interactive className="w-min" padding={4}>
                        <Icon
                            size={48}
                            variant={elementVariant}
                            outerRunes={OUTER_RUNES[action.tier - 1] ?? "wide"}
                            outerShape={7}
                            innerRunes="gap"
                            innerShape={INNER_SHAPES[action.tier - 1] ?? 10}
                        >
                            {cloneElement(SKILL_ICONS.EXPLORATION, { size: 48 })}
                        </Icon>
                    </Paper>
                    <Flex direction="column">
                        <ActionHeader
                            name={action.name ?? humanize(action.id)}
                            level={actionState.level}
                            currentXP={actionState.xp}
                            neededXP={neededXP}
                            tier={action.tier}
                            isUnlocked={isUnlocked}
                            actionMilestones={actionMilestones}
                            actionXPTable={actionXPTable}
                            xpConfig={EXPLORATION_CONFIG.neededXP}
                        />
                        {isUnlocked ? (
                            <ActionProgress
                                actionState={actionState}
                                isActive={isActive}
                                onToggle={onToggle}
                                canStart={canStart}
                                durationMs={durationMs}
                                neededXP={neededXP}
                                currentXP={actionState.xp}
                                variant={elementVariant}
                                actionLabel="Explore"
                            />
                        ) : (
                            <Button
                                variant={elementVariant}
                                className="w-100"
                                size="medium"
                                disabled={!canUnlock}
                                onClick={onUnlock}
                            >
                                Unlock
                            </Button>
                        )}
                    </Flex>
                </Flex>
                {isUnlocked ? (
                    <>
                        <ActionDetails
                            actionTime={durationMs / 1000}
                            actionXP={getActionXPReward(EXPLORATION_CONFIG, action, player)}
                            outputMultiplier={outputMultiplier}
                            preservationChance={getActionPreservationChance(player, EXPLORATION_CONFIG, action)}
                            effectStacks={effectStacks}
                        />
                        <ActionResources
                            consumes={action.consumes ?? []}
                            produces={action.produces ?? []}
                            outputMultiplier={outputMultiplier}
                        />
                    </>
                ) : (
                    <ActionResources requires={action.unlockCosts ?? []} />
                )}
            </Flex>
        </Paper>
    )
}

export function ExplorationPage() {
    const [selectedAreaId, setSelectedAreaId] = useState(WORLD_DATA.map.startingAreaId)
    const { player, startAction, stopAction, unlockAction } = useGame()
    const skillId = EXPLORATION_CONFIG.id
    const skillProgress = getSkillProgress(player, skillId)
    const selectedArea = WORLD_AREA_BY_ID[selectedAreaId] ?? WORLD_AREAS[0]
    const selectedAction = EXPLORATION_CONFIG.actions.find(action => action.areaId === selectedArea.id)
    const storedActionState = player.skills?.[skillId]?.actions?.[selectedAction.id]
    const actionState = storedActionState ?? {
        level: 1,
        xp: 0,
        progressMs: 0,
        unlocked: Boolean(selectedAction.unlockedByDefault),
    }
    const isUnlocked = Boolean(actionState.unlocked)
    const isActive = player.activeAction?.skillId === skillId &&
        player.activeAction?.actionId === selectedAction.id

    return (
        <Flex direction="column" className="page-flex page-flex-exploration" padding={32} gap={24}>
            <Paper layer={0}>
                <SkillSummary
                    skillId={skillId}
                    title="Exploration"
                    skillProgress={skillProgress}
                    milestones={getSkillMilestoneDetails(player, EXPLORATION_CONFIG)}
                    variant="exploration"
                    progressEnabled={false}
                    icon={
                        <Icon size={64} variant="exploration" outerRunes="solid" outerShape={3}
                            innerRunes="gap" innerShape={5}>
                            {cloneElement(SKILL_ICONS.EXPLORATION, { size: 48 })}
                        </Icon>
                    }
                />
            </Paper>

            <Paper layer={0} className="exploration-map-panel">
                <Flex direction="column" align="stretch" gap={8}>
                    <Heading h="2">The Known World</Heading>
                    <HexMap
                        areas={WORLD_AREAS}
                        mapVariant="exploration"
                        startingAreaId={WORLD_DATA.map.startingAreaId}
                        selectedAreaId={selectedArea.id}
                        actionLevels={Object.fromEntries(WORLD_AREAS.map(area => [
                            area.id,
                            player.skills?.[skillId]?.actions?.[area.actionId]?.level ?? 1,
                        ]))}
                        onSelectArea={setSelectedAreaId}
                    />
                </Flex>
            </Paper>

            <ExplorationActionCard
                action={selectedAction}
                player={player}
                actionState={actionState}
                isUnlocked={isUnlocked}
                isActive={isActive}
                canUnlock={canUnlockAction(player, skillId, selectedAction.id)}
                canStart={canStartAction(player, skillId, selectedAction.id)}
                onUnlock={() => unlockAction(skillId, selectedAction.id)}
                onToggle={() => {
                    if (isActive) stopAction(skillId, selectedAction.id)
                    else startAction(skillId, selectedAction.id)
                }}
            />
        </Flex>
    )
}
