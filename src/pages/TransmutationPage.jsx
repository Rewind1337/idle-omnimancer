import { cloneElement, useState } from "react"

import { Flex } from "../components/Flex"
import { Grid } from "../components/Grid"
import { Paper } from "../components/Paper"
import { Icon } from "../components/Icon"
import { Button } from "../components/Button"
import { SkillSummary } from "../components/skills/SkillSummary"
import { ElementFilter } from "../components/skills/ElementFilter"
import { ActionHeader } from "../components/actions/ActionHeader"
import { ActionDetails } from "../components/actions/ActionDetails"
import { ActionProgress } from "../components/actions/ActionProgress"
import { ActionResources } from "../components/actions/ActionResources"

import { cx, humanize } from "../utility/helpers"
import { TRANSMUTATION_CONFIG } from "../data/transmutationConfig"
import { getActionXPTable } from "../data/skillConfig"
import { SKILL_ICONS, TRANSMUTATION_ACTION_ICONS } from "../data/iconLibrary"
import {
    canUnlockAction,
    canStartAction,
    getActionDurationMs,
    getActionManaCost,
    getActionOutputMultiplier,
    getActionPreservationChance,
    getActionXPReward,
    getActionEffectStacks,
    getActionMilestoneDetails,
    getSkillMilestoneDetails,
    getSkillProgress,
    getVisibleActions,
    getActionUnlockCosts,
} from "../game/gameEngine"
import { useGame } from "../hooks/useGame"

const InnerShapeMap = [3, 4, 5, 6, 7, 8, 9, 10]
const OuterRunesMap = ["dotted", "dotted", "dashed", "dashed", "gap", "gap", "wide", "wide"]

function TransmutationAction({ action, player, skillId, isActive, isUnlocked, actionState, canUnlock, canStart, onToggle, onUnlock }) {
    const elementVariant = action.element ?? "transmutation"
    const durationMs = isUnlocked ? getActionDurationMs(TRANSMUTATION_CONFIG, action, player) : 0
    const xpTable = isUnlocked ? getActionXPTable(action.id) : null
    const neededXP = !isUnlocked || actionState.level >= 100
        ? null
        : xpTable[actionState.level - 1].neededXP
    const actionMilestones = isUnlocked
        ? getActionMilestoneDetails(player, TRANSMUTATION_CONFIG, action)
        : []
    const effectStacks = isUnlocked
        ? getActionEffectStacks(player, TRANSMUTATION_CONFIG, action)
        : {}
    const outputMultiplier = isUnlocked
        ? getActionOutputMultiplier(player, TRANSMUTATION_CONFIG, action)
        : 1
    const hasManaCost = Boolean(TRANSMUTATION_CONFIG.mana?.cost || action.manaCost > 0)
    const manaCost = isUnlocked && hasManaCost
        ? getActionManaCost(TRANSMUTATION_CONFIG, action, player)
        : null

    return (
        <Paper layer={1} variant={elementVariant} className="action action-transmutation">
            <Flex direction="column">
                <Flex direction="row">
                    <Paper round layer="0" interactive className="w-min" padding={4}>
                        <Icon
                            size={48}
                            variant={elementVariant}
                            outerRunes={OuterRunesMap[action.tier - 1] ?? "wide"}
                            outerShape={7}
                            innerRunes="gap"
                            innerShape={InnerShapeMap[action.tier - 1] ?? 10}
                        >
                            {cloneElement(TRANSMUTATION_ACTION_ICONS[action.tier - 1] ?? TRANSMUTATION_ACTION_ICONS[0], { size: 48 })}
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
                            actionXPTable={xpTable}
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
                                actionLabel="Transmute"
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
                        <ActionDetails player={player} skill={TRANSMUTATION_CONFIG} action={action}
                            actionTime={durationMs / 1000}
                            actionXP={getActionXPReward(TRANSMUTATION_CONFIG, action, player)}
                            manaCost={manaCost}
                            outputMultiplier={outputMultiplier}
                            preservationChance={getActionPreservationChance(player, TRANSMUTATION_CONFIG, action)}
                            effectStacks={effectStacks}
                        />
                        <ActionResources
                            consumes={action.consumes ?? []}
                            produces={action.produces ?? []}
                            outputMultiplier={outputMultiplier}
                        />
                    </>
                ) : (
                    <ActionResources requires={getActionUnlockCosts(player, skillId, action.id)} />
                )}
            </Flex>
        </Paper>
    )
}

export function TransmutationPage() {
    const { player, startAction, stopAction, unlockAction } = useGame()
    const [elementFilter, setElementFilter] = useState("all")
    const skillId = TRANSMUTATION_CONFIG.id
    const skillProgress = getSkillProgress(player, skillId)
    const pageVariant = "transmutation"

    return (
        <Flex direction="column" className={cx("page-flex page-flex-transmutation")} padding={32} gap={32}>
            <Paper layer={0}>
                <SkillSummary
                    skillId={skillId}
                    title={humanize(TRANSMUTATION_CONFIG.id)}
                    skillProgress={skillProgress}
                    milestones={getSkillMilestoneDetails(player, TRANSMUTATION_CONFIG)}
                    variant={pageVariant}
                    icon={
                        <Icon
                            size={64}
                            variant={pageVariant}
                            outerRunes="solid"
                            outerShape={3}
                            innerRunes="gap"
                            innerShape={5}
                        >
                            {cloneElement(SKILL_ICONS.TRANSMUTATION, { size: 48 })}
                        </Icon>
                    }
                />
            </Paper>
            <Paper layer={0}>
                <ElementFilter value={elementFilter} onChange={setElementFilter} variant={pageVariant} />
                <Grid columns={1}>
                    {getVisibleActions(player, skillId)
                        .filter(action => elementFilter === "all" || action.element === elementFilter)
                        .map(action => {
                            const actionState = player.skills[skillId].actions[action.id]
                            const isUnlocked = Boolean(actionState?.unlocked)
                            const isActive = player.activeAction?.skillId === skillId &&
                                player.activeAction?.actionId === action.id

                            return (
                                <TransmutationAction
                                    key={action.id}
                                    action={action}
                                    skillId={skillId}
                                    player={player}
                                    actionState={actionState}
                                    isActive={isActive}
                                    isUnlocked={isUnlocked}
                                    canStart={canStartAction(player, skillId, action.id)}
                                    canUnlock={canUnlockAction(player, skillId, action.id)}
                                    onUnlock={() => unlockAction(skillId, action.id)}
                                    onToggle={() => {
                                        if (isActive) stopAction(skillId, action.id)
                                        else startAction(skillId, action.id)
                                    }}
                                />
                            )
                        })}
                </Grid>
            </Paper>
        </Flex>
    )
}
