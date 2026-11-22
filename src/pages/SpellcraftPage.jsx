import { cloneElement, useState } from "react"

import { Flex } from "../components/Flex"
import { Grid } from "../components/Grid"
import { Paper } from "../components/Paper"
import { Icon } from "../components/Icon"
import { Button } from "../components/Button"
import { SkillSummary } from "../components/skills/SkillSummary"
import { ElementFilter } from "../components/skills/ElementFilter"
import { ManaBar } from "../components/resources/ManaBar"
import { ActionHeader } from "../components/actions/ActionHeader"
import { ActionDetails } from "../components/actions/ActionDetails"
import { ActionProgress } from "../components/actions/ActionProgress"
import { ActionResources } from "../components/actions/ActionResources"

import { cx, humanize } from "../utility/helpers"
import { SPELLCRAFT_CONFIG } from "../data/spellcraftConfig"
import { getActionXPTable } from "../data/skillConfig"
import { SKILL_ICONS, SPELLCRAFT_ACTION_ICONS } from "../data/iconLibrary"
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

function SpellcraftAction({ action, player, isActive, isUnlocked, actionState, canUnlock, canStart, onToggle, onUnlock }) {
    const elementIcons = SPELLCRAFT_ACTION_ICONS[action.element?.toUpperCase()] ?? SPELLCRAFT_ACTION_ICONS.EARTH
    const actionIcon = elementIcons[action.tier - 1] ?? elementIcons[0]
    const durationMs = isUnlocked ? getActionDurationMs(SPELLCRAFT_CONFIG, action, player) : 0
    const xpTable = isUnlocked ? getActionXPTable(action.id) : null
    const neededXP = !isUnlocked || actionState.level >= 100
        ? null
        : xpTable[actionState.level - 1].neededXP
    const actionMilestones = isUnlocked
        ? getActionMilestoneDetails(player, SPELLCRAFT_CONFIG, action)
        : []
    const effectStacks = isUnlocked
        ? getActionEffectStacks(player, SPELLCRAFT_CONFIG, action)
        : {}
    const elementVariant = action.element ?? "spellcraft"
    const outputMultiplier = isUnlocked
        ? getActionOutputMultiplier(player, SPELLCRAFT_CONFIG, action)
        : 1

    return (
        <Paper layer={1} variant={elementVariant} className="action action-spellcraft">
            <Flex direction="column">
                <Flex direction="row">
                    <Paper round layer="0" interactive className="w-min" padding={4}>
                        <Icon size={48} variant={elementVariant} outerRunes={OuterRunesMap[action.tier - 1] ?? "wide"}
                            outerShape={7} innerRunes="gap" innerShape={InnerShapeMap[action.tier - 1] ?? 10}>
                            {cloneElement(actionIcon, { size: 48 })}
                        </Icon>
                    </Paper>
                    <Flex direction="column">
                        <ActionHeader name={action.name ?? humanize(action.id)} level={actionState.level}
                            currentXP={actionState.xp} neededXP={neededXP}
                            tier={action.tier} isUnlocked={isUnlocked} skillName="Spellcraft"
                            actionMilestones={actionMilestones} actionXPTable={xpTable} xpConfig={SPELLCRAFT_CONFIG.neededXP} />
                        {isUnlocked ? (
                            <ActionProgress actionState={actionState} isActive={isActive} onToggle={onToggle}
                                canStart={canStart} durationMs={durationMs} neededXP={neededXP} currentXP={actionState.xp}
                                variant={elementVariant} actionLabel="Cast" />
                        ) : (
                            <Button variant={elementVariant} className="w-100" size="medium"
                                disabled={!canUnlock} onClick={onUnlock}>
                                Unlock
                            </Button>
                        )}
                    </Flex>
                </Flex>
                {isUnlocked ? (
                    <>
                        <ActionDetails actionTime={durationMs / 1000}
                            actionXP={getActionXPReward(SPELLCRAFT_CONFIG, action, player)}
                            manaCost={getActionManaCost(SPELLCRAFT_CONFIG, action, player)}
                            outputMultiplier={outputMultiplier}
                            preservationChance={getActionPreservationChance(player, SPELLCRAFT_CONFIG, action)}
                            effectStacks={effectStacks} />
                        <ActionResources consumes={action.consumes ?? []} produces={action.produces ?? []}
                            outputMultiplier={outputMultiplier} />
                    </>
                ) : (
                    <ActionResources requires={getActionUnlockCosts(player, skillId, action.id)} />
                )}
            </Flex>
        </Paper>
    )
}

export function SpellcraftPage() {
    const { player, startAction, stopAction, unlockAction } = useGame()
    const [elementFilter, setElementFilter] = useState("all")
    const skillId = SPELLCRAFT_CONFIG.id
    const skillProgress = getSkillProgress(player, skillId)
    const pageVariant = "spellcraft"

    return (
        <Flex direction="column" className={cx("page-flex page-flex-spellcraft")} padding={32} gap={32}>
            <Paper layer={0}>
                <Flex direction="column">
                    <SkillSummary
                        skillId={skillId}
                        title={humanize(SPELLCRAFT_CONFIG.id)}
                        skillProgress={skillProgress}
                        milestones={getSkillMilestoneDetails(player, SPELLCRAFT_CONFIG)}
                        variant={pageVariant}
                        icon={
                            <Icon
                                size={64} variant={pageVariant} outerRunes="solid" outerShape={3}
                                innerRunes="gap" innerShape={5}>
                                {cloneElement(SKILL_ICONS.SPELLCRAFT, { size: 48 })}
                            </Icon>
                        }
                    />
                    <Paper layer={1}>
                        <ManaBar />
                    </Paper>
                </Flex>
            </Paper>
            <Paper layer={0}>
                <Flex>
                    <ElementFilter value={elementFilter} onChange={setElementFilter} variant={pageVariant} />
                </Flex>
                <Grid columns={1}>
                    {getVisibleActions(player, skillId)
                        .filter(action => elementFilter === "all" || action.element === elementFilter)
                        .map(action => {
                            const actionState = player.skills[skillId].actions[action.id]
                            const isUnlocked = Boolean(actionState?.unlocked)
                            const isActive = player.activeAction?.skillId === skillId &&
                                player.activeAction?.actionId === action.id

                            return (
                                <SpellcraftAction key={action.id} action={action} player={player} actionState={actionState}
                                    isActive={isActive} isUnlocked={isUnlocked}
                                    canStart={canStartAction(player, skillId, action.id)}
                                    canUnlock={canUnlockAction(player, skillId, action.id)}
                                    onUnlock={() => unlockAction(skillId, action.id)}
                                    onToggle={() => {
                                        if (isActive) stopAction(skillId, action.id)
                                        else startAction(skillId, action.id)
                                    }} />
                            )
                        })}
                </Grid>
            </Paper>
        </Flex>
    )
}
