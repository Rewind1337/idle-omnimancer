import { cloneElement, useState } from "react"

import { Flex } from "../components/Flex"
import { Paper } from "../components/Paper"
import { Icon } from "../components/Icon"
import { Button } from "../components/Button"
import { SkillSummary } from "../components/skills/SkillSummary"
import { ActionHeader } from "../components/actions/ActionHeader"
import { ActionDetails } from "../components/actions/ActionDetails"
import { ActionProgress } from "../components/actions/ActionProgress"
import { ActionResources } from "../components/actions/ActionResources"
import { SelectionModal } from "../components/modals/SelectionModal"

import { UNVEILING_CONFIG } from "../data/unveilingConfig"
import { ITEM_DATA_BY_ID } from "../data/itemData"
import { COMPANION_DATA_BY_CONTAINER_ID } from "../data/companionData"
import { OTHER_ICONS, SKILL_ICONS } from "../data/iconLibrary"
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
    getActionSelectableItems,
    getSkillProgress,
    getSkillMilestoneDetails,
    getVisibleActions,
    getActionUnlockCosts,
} from "../game/gameEngine"
import { useGame } from "../hooks/useGame"

import "./UnveilingPage.scss"

function UnveilingActionCard({
    action,
    skillId,
    player,
    actionState,
    isUnlocked,
    isActive,
    canUnlock,
    canStart,
    onToggle,
    onUnlock,
    onChooseItems,
}) {
    const durationMs = isUnlocked ? getActionDurationMs(UNVEILING_CONFIG, action, player) : 0
    const actionXPTable = isUnlocked ? getActionXPTable(action.id) : null
    const neededXP = !isUnlocked || actionState.level >= 100
        ? null
        : actionXPTable?.[actionState.level - 1]?.neededXP ?? null
    const actionMilestones = isUnlocked
        ? getActionMilestoneDetails(player, UNVEILING_CONFIG, action)
        : []
    const effectStacks = isUnlocked
        ? getActionEffectStacks(player, UNVEILING_CONFIG, action)
        : {}
    const outputMultiplier = isUnlocked
        ? getActionOutputMultiplier(player, UNVEILING_CONFIG, action)
        : 1
    const selectedItem = ITEM_DATA_BY_ID[actionState.selectedItemId]
    const selectedCompanion = selectedItem
        ? COMPANION_DATA_BY_CONTAINER_ID[selectedItem.id]
        : null
    const isDuplicateCompanion = selectedCompanion &&
        (player.unlockedCompanions ?? []).includes(selectedCompanion.id)
    const experienceItem = isDuplicateCompanion
        ? UNVEILING_CONFIG.companionRewards?.experienceItemsByElement?.[selectedItem.variant]
        : null
    const unidentifiedArtifact = selectedItem?.type === "unidentifiedArtifact"
        ? ITEM_DATA_BY_ID[selectedItem.revealsItemId]
        : null
    const identificationChance = action.processesUnidentifiedArtifacts
        ? action.identificationChance ?? 0.1
        : 0
    const producedResources = [
        ...(experienceItem ? [{
            item: experienceItem,
            amount: selectedCompanion.duplicateCandyAmount ?? selectedCompanion.tier ?? 1,
        }] : []),
        ...(unidentifiedArtifact && selectedItem?.revealsTrashItemId && identificationChance > 0 ? [
            {
                item: unidentifiedArtifact.id,
                amountLabel: (identificationChance * 100).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                }) + "%",
            },
            {
                item: selectedItem.revealsTrashItemId,
                amountLabel: ((1 - identificationChance) * 100).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                }) + "%",
            },
        ] : []),
    ]
    const actionIcon = action.processesUnidentifiedArtifacts
        ? OTHER_ICONS.ARTIFACT
        : action.id === "action:destroy_research_books"
            ? SKILL_ICONS.RESEARCH
            : action.id === "action:destroy_spellcraft_materials"
                ? SKILL_ICONS.SPELLCRAFT
                : action.id === "action:destroy_transmutation_materials"
                    ? SKILL_ICONS.TRANSMUTATION
                    : action.id === "action:destroy_exploration_materials"
                        ? SKILL_ICONS.EXPLORATION
                        : SKILL_ICONS.COMBAT

    return (
        <Paper layer={1} variant="unveiling" className="action action-unveiling">
            <Flex direction="column">
                <Flex direction="row" align="center" gap={12}>
                    <Paper round layer="0" interactive className="w-min" padding={4}>
                        <Icon
                            size={48}
                            variant="unveiling"
                            outerRunes="wide"
                            outerShape={7}
                            innerRunes="gap"
                            innerShape={8}
                        >
                            {cloneElement(actionIcon, { size: 48 })}
                        </Icon>
                    </Paper>
                    <Flex direction="column" gap={4} className="flex-grow">
                    <ActionHeader
                        name={action.name}
                        level={actionState.level}
                        currentXP={actionState.xp}
                        neededXP={neededXP}
                        tier={action.tier}
                        isUnlocked={isUnlocked}
                        actionMilestones={actionMilestones}
                        actionXPTable={actionXPTable}
                    />
                    {isUnlocked ? (
                        <>
                            <ActionProgress
                                skillId={skillId}
                                actionId={action.id}
                                isActive={isActive}
                                onToggle={onToggle}
                                canStart={canStart}
                                durationMs={durationMs}
                                neededXP={neededXP}
                                currentXP={actionState.xp}
                                variant="unveiling"
                                actionLabel="Unveil"
                                leadingControl={action.inputSelection ? (
                                    <Button
                                        variant="unveiling"
                                        size="medium"
                                        className="action-progress-leading"
                                        disabled={isActive}
                                        icon={OTHER_ICONS.ARROW_UP_RIGHT}
                                        onClick={onChooseItems}
                                    >
                                        {selectedItem ? "Change Item" : "Choose Item"}
                                    </Button>
                                ) : null}
                            />
                        </>
                    ) : (
                        <Button
                            variant="unveiling"
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
                        {(!action.inputSelection || selectedItem) && (
                            <ActionDetails player={player} skill={UNVEILING_CONFIG} action={action}
                                actionTime={durationMs / 1000}
                                actionXP={getActionXPReward(UNVEILING_CONFIG, action, player)}
                                outputMultiplier={outputMultiplier}
                                itemValue={selectedItem?.type === "companionContainer" ? null : selectedItem?.baseValue ?? null}
                                preservationChance={getActionPreservationChance(player, UNVEILING_CONFIG, action)}
                                effectStacks={effectStacks}
                            />
                        )}
                        <ActionResources
                            consumes={selectedItem ? [selectedItem.id] : []}
                            produces={producedResources}
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

export function UnveilingPage() {
    const {
        player,
        startAction,
        stopAction,
        unlockAction,
        selectActionItem,
    } = useGame()
    const skillId = UNVEILING_CONFIG.id
    const skillProgress = getSkillProgress(player, skillId)
    const visibleActions = getVisibleActions(player, skillId)
    const processingAction = visibleActions.find(action => action.processesCompanionContainers)
    const destructionActions = visibleActions.filter(action => !action.processesCompanionContainers)
    const [selectionActionId, setSelectionActionId] = useState(null)
    const selectionAction = visibleActions.find(action => action.id === selectionActionId)
    const selectableItems = selectionAction
        ? getActionSelectableItems(player, skillId, selectionAction.id)
        : []

    const renderActionCard = action => {
        const actionState = player.skills?.[skillId]?.actions?.[action.id] ?? {
            level: 1, xp: 0, progressMs: 0, unlocked: false, selectedItemId: null,
        }
        const isUnlocked = Boolean(actionState.unlocked)
        const isActive = player.activeAction?.skillId === skillId &&
            player.activeAction?.actionId === action.id

        return (
            <UnveilingActionCard
                key={action.id}
                action={action}
                skillId={skillId}
                player={player}
                actionState={actionState}
                isUnlocked={isUnlocked}
                isActive={isActive}
                canStart={canStartAction(player, skillId, action.id)}
                canUnlock={canUnlockAction(player, skillId, action.id)}
                onUnlock={() => unlockAction(skillId, action.id)}
                onChooseItems={() => setSelectionActionId(action.id)}
                onToggle={() => {
                    if (isActive) stopAction(skillId, action.id)
                    else startAction(skillId, action.id)
                }}
            />
        )
    }

    return (
        <Flex direction="column" className="page-flex page-flex-unveiling" padding={32} gap={32}>
            <Paper layer={0}>
                <Flex direction="column" gap={16}>
                <SkillSummary
                    skillId={skillId}
                    title="Unveiling"
                    skillProgress={skillProgress}
                    milestones={getSkillMilestoneDetails(player, UNVEILING_CONFIG)}
                    variant="unveiling"
                    icon={
                        <Icon size={64} variant="unveiling" outerRunes="solid" outerShape={7}
                            innerRunes="gap" innerShape={5}>
                            {SKILL_ICONS.UNVEILING}
                        </Icon>
                    }
                />
                    {processingAction && renderActionCard(processingAction)}
                </Flex>
            </Paper>

            <Paper layer={0}>
                <Flex direction="column" gap={16}>
                    {destructionActions.map(renderActionCard)}
                </Flex>
            </Paper>

            <SelectionModal
                visible={Boolean(selectionAction)}
                onClose={() => setSelectionActionId(null)}
                items={selectableItems}
                selectedItemId={player.skills?.[skillId]?.actions?.[selectionActionId]?.selectedItemId}
                onSelect={itemId => selectActionItem(skillId, selectionActionId, itemId)}
                variant="unveiling"
            />
        </Flex>
    )
}
