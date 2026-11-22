import { useState } from "react"

import { ActionHeader } from "../components/actions/ActionHeader"
import { Badge } from "../components/Badge"
import { Button } from "../components/Button"
import { Flex } from "../components/Flex"
import { Heading } from "../components/Heading"
import { Icon } from "../components/Icon"
import { Paper } from "../components/Paper"
import { Progress } from "../components/Progress"
import { EffectStack } from "../components/EffectStack"
import { SkillSummary } from "../components/skills/SkillSummary"
import { Text } from "../components/Text"
import { CompanionSelectionModal } from "../components/modals/CompanionSelectionModal"

import { COMPANION_CONFIG } from "../data/companionConfig"
import { COMPANION_DATA } from "../data/companionData"
import { ITEM_DATA_BY_ID } from "../data/itemData"
import { getActionXPTable } from "../data/skillConfig"
import { OTHER_ICONS, SKILL_ICONS } from "../data/iconLibrary"
import {
    canStartAction,
    getActionDurationMs,
    getActionProgress,
    getActionConsumeResources,
    getActionXPReward,
    getActionEffectStacks,
    getActionMilestoneDetails,
    getActionEffectSummary,
    getCompanionLevelProgress,
    getCompanionSlotUnlockCost,
    getSkillProgress,
} from "../game/gameEngine"
import { useGame } from "../hooks/useGame"

import "./CompanionPage.scss"

const formatActionValue = value => Number(value.toFixed(2)).toLocaleString()

const SLOT_IDS = ["any", "earth", "air", "water"]
const SKILL_NAMES = {
    "skill:research": "Research",
    "skill:spellcraft": "Spellcraft",
    "skill:transmutation": "Transmutation",
    "skill:exploration": "Exploration",
    "skill:unveiling": "Unveiling",
    "skill:combat": "Combat",
}
const EFFECT_NAMES = {
    sellValue: "Sell value",
    xpGain: "Action XP",
    actionTime: "Action speed",
    itemOutput: "Item output",
    preservation: "Input preservation",
    manaCost: "Mana cost",
    manaCapacity: "Mana capacity",
    manaRegeneration: "Mana regeneration",
    companionChance: "Companion-container chance",
    artifactChance: "Artifact chance",
    unlockCostReduction: "Unlock costs",
}

const getEffectValue = (effect, perLevel, level) => {
    const startingBonus = effect === "preservation"
        ? 0
        : COMPANION_CONFIG.companionLeveling.effectStartingBonus ?? 0
    const growth = effect === "preservation"
        ? level * perLevel
        : startingBonus + Math.max(0, level - 1) * perLevel
    if (effect === "preservation") return "+" + (growth * 100).toFixed(2) + "%"
    const multiplier = effect === "manaCost" || effect === "unlockCostReduction"
        ? Math.max(0.1, 1 - growth)
        : 1 + growth
    return "x" + multiplier.toFixed(2)
}

function CompanionSlotCard({ slotId, slot, companion, unlocked, player, onUnlock, onChoose }) {
    const unlockCost = getCompanionSlotUnlockCost(player, slotId)
    const slotVariant = slot.element ?? "companions"
    const companionProgress = companion
        ? getCompanionLevelProgress(player, companion.id)
        : null
    const emptySlotIcon = slot.element === null
        ? ITEM_DATA_BY_ID["item:neutral_prism_i"]?.icon ?? OTHER_ICONS.ARTIFACT
        : ITEM_DATA_BY_ID[
            slot.element === "earth" ? "item:earth_geode_i" :
                slot.element === "air" ? "item:air_egg_i" : "item:water_shell_i"
        ]?.icon

    return (
        <Paper layer={1} variant={slotVariant} className="companion-slot-card">
            <Flex direction="column" gap={12}>
                <Flex justify="space-between">
                    <Heading h="2">{slot.name}</Heading>
                    {unlocked
                        ? <Badge variant={slotVariant}>Unlocked</Badge>
                        : <Badge variant="transparent">Locked</Badge>}
                </Flex>
                {!unlocked ? (
                    <>
                        <Text size="small">Unlock this slot to assign another companion.</Text>
                        <Button variant={slotVariant} size="medium"
                            disabled={(player.currencies?.coins ?? 0) < unlockCost}
                            onClick={onUnlock}>
                            Unlock · {unlockCost.toLocaleString()} Coins
                        </Button>
                    </>
                ) : (
                    <>
                        {companion ? (
                            <Flex direction="column" align="center" gap={6} className="companion-slot-selected">
                                <Icon size={64} variant={companion.element}>{companion.icon}</Icon>
                                <Heading h="2">{companion.name}</Heading>
                                <Flex justify="center" wrap gap={6}>
                                    <Badge variant="transparent">Tier {companion.tier}</Badge>
                                    <Badge variant="transparent">Level {companionProgress.level}</Badge>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text size="small">Companion XP</Text>
                                    <Text size="small">
                                        {companionProgress.neededXP === null
                                            ? "MAX LEVEL"
                                            : companionProgress.xp.toLocaleString() + " / " +
                                                companionProgress.neededXP.toLocaleString()}
                                    </Text>
                                </Flex>
                                <Progress layer={2} size="small" variant={companion.element}
                                    percentage={companionProgress.neededXP
                                        ? companionProgress.xp / companionProgress.neededXP * 100
                                        : 100} />
                            </Flex>
                        ) : (
                            <Flex align="center" justify="center" className="companion-slot-empty">
                                <Icon size={56} variant={slotVariant}>{emptySlotIcon}</Icon>
                                <Text size="small">No companion selected</Text>
                            </Flex>
                        )}
                        <Button variant={slotVariant} size="medium" onClick={onChoose}>
                            {companion ? "Choose / Switch Companion" : "Choose Companion"}
                        </Button>
                    </>
                )}
            </Flex>
        </Paper>
    )
}

function CompanionTrainingProgress({ skillId, actionId, isActive, durationMs }) {
    const actionProgress = useGameActionProgress(skillId, actionId)
    const progress = getActionProgress(actionProgress, durationMs)

    return (
        <Progress
            className="companion-training-progress"
            layer={2}
            size="medium"
            variant="companions"
            percentage={isActive ? progress : 0}
            animated={isActive}
        />
    )
}

function CompanionCollectionCard({ companion, player, assigned }) {
    const progress = getCompanionLevelProgress(player, companion.id)
    const permanentValue = getEffectValue(companion.permanentEffect.effect, companion.permanentEffect.perLevel, progress.level)
    const activeValue = getEffectValue(companion.activeEffect.effect, companion.activeEffect.perLevel, progress.level)
    const targetSkill = SKILL_NAMES[companion.activeEffect.targetSkillId] ??
        companion.activeEffect.targetSkillId.replace("skill:", "")

    return (
        <Paper layer={1} variant={companion.element} className="companion-collection-card">
            <Flex direction="column" gap={8}>
                <Flex align="center" gap={10}>
                    <Icon size={40} variant={companion.element}>
                        {companion.icon}
                    </Icon>
                    <Flex direction="column" gap={2} className="flex-grow">
                        <Heading h="3">{companion.name}</Heading>
                        <Text size="small">
                            {companion.element} · Tier {companion.tier} · Level {progress.level}
                        </Text>
                    </Flex>
                    {assigned && <Badge variant="companions">Active</Badge>}
                </Flex>
                <Flex direction="row" justify="space-between">
                    <Text size="small">Companion XP</Text>
                    <Text size="small">
                        {progress.neededXP === null
                            ? "MAX LEVEL"
                            : progress.xp.toLocaleString() + " / " + progress.neededXP.toLocaleString()}
                    </Text>
                </Flex>
                <Progress layer={2} size="small" variant={companion.element}
                    percentage={progress.neededXP ? progress.xp / progress.neededXP * 100 : 100} />
                <Flex direction="column" gap={3} className="companion-effect">
                    <Text size="small">Permanent · Global</Text>
                    <Text size="small">
                        {EFFECT_NAMES[companion.permanentEffect.effect]} {permanentValue}
                    </Text>
                </Flex>
                <Flex direction="column" gap={3} className="companion-effect">
                    <Text size="small">Slot Effect · {targetSkill}</Text>
                    <Text size="small">
                        {EFFECT_NAMES[companion.activeEffect.effect]} {activeValue}
                    </Text>
                </Flex>
            </Flex>
        </Paper>
    )
}

export function CompanionPage() {
    const { player, startAction, stopAction, unlockCompanionSlot, selectCompanion } = useGame()
    const skillId = COMPANION_CONFIG.id
    const trainingAction = COMPANION_CONFIG.actions[0]
    const skillProgress = getSkillProgress(player, skillId)
    const actionState = player.skills?.[skillId]?.actions?.[trainingAction.id] ?? {
        level: 1, xp: 0, progressMs: 0, unlocked: false,
    }
    const isActive = player.activeAction?.skillId === skillId &&
        player.activeAction?.actionId === trainingAction.id
    const durationMs = getActionDurationMs(COMPANION_CONFIG, trainingAction, player)
    const canStart = canStartAction(player, skillId, trainingAction.id)
    const progress = getActionProgress(actionState, durationMs)
    const unlockedSlots = new Set(player.unlockedCompanionSlots ?? ["any"])
    const activeSlots = player.activeCompanionSlots ?? { any: null, earth: null, air: null, water: null }
    const [selectionSlotId, setSelectionSlotId] = useState(null)
    const selectionSlot = selectionSlotId ? COMPANION_CONFIG.slots[selectionSlotId] : null
    const assignedIds = new Set(Object.values(activeSlots).filter(Boolean))
    const selectableCompanions = selectionSlot
        ? COMPANION_DATA.filter(companion => {
            const matchesSlot = selectionSlot.element === null ||
                companion.element === "neutral" ||
                companion.element === selectionSlot.element
            const assignedElsewhere = Object.entries(activeSlots).some(([assignedSlotId, companionId]) =>
                assignedSlotId !== selectionSlotId && companionId === companion.id
            )
            return matchesSlot && !assignedElsewhere &&
                player.unlockedCompanions?.includes(companion.id)
        })
        : []
    const ownedCompanions = COMPANION_DATA.filter(companion =>
        player.unlockedCompanions?.includes(companion.id)
    )
    const actionXPTable = getActionXPTable(trainingAction.id)
    const neededXP = actionState.level >= 100
        ? null
        : actionXPTable?.[actionState.level - 1]?.neededXP ?? null
    const trainingCost = getActionConsumeResources(player, COMPANION_CONFIG, trainingAction)
        .find(resource => resource.item === "currency:coins")?.amount ?? 0
    const actionXPReward = getActionXPReward(COMPANION_CONFIG, trainingAction, player)
    const actionEffectStacks = getActionEffectStacks(player, COMPANION_CONFIG, trainingAction)
    const actionMilestones = getActionMilestoneDetails(player, COMPANION_CONFIG, trainingAction)

    return (
        <Flex direction="column" className="page-flex page-flex-companions" padding={32} gap={24}>
            <Paper layer={0}>
                <SkillSummary
                    skillId={skillId}
                    title="Companions"
                    skillProgress={skillProgress}
                    milestones={[]}
                    variant="companions"
                    progressEnabled
                    skillXPTooltip="Companion skill XP is derived from the combined levels of all 16 companions."
                    totalProgressTooltip="Total progress is the sum of all companion levels, for a maximum of 1,600 levels."
                    icon={
                        <Icon size={64} variant="companions" outerRunes="solid" outerShape={7}
                            innerRunes="gap" innerShape={5}>
                            {SKILL_ICONS.COMPANIONS}
                        </Icon>
                    }
                />
            </Paper>

            <Paper layer={0} className="companion-training-panel">
                <Flex direction="column" gap={10}>
                    <ActionHeader
                        name={trainingAction.name}
                        level={actionState.level}
                        isUnlocked={Boolean(actionState.unlocked)}
                        currentXP={actionState.xp}
                        neededXP={neededXP}
                        tier={trainingAction.tier}
                        actionXPTable={actionXPTable}
                        actionMilestones={actionMilestones}
                    />
                    <Flex wrap gap={8}>
                        <Badge variant="transparent" interactive icon={OTHER_ICONS.HOURGLASS}
                            tooltip={<Flex direction="column" gap={8}>
                                <Heading h="4" className="w-100 align-center">
                                    Time needed to complete this action.
                                </Heading>
                                <hr />
                                <EffectStack title="Time effects" icon={OTHER_ICONS.HOURGLASS}
                                    entries={actionEffectStacks.actionTime ?? []}
                                    summary={getActionEffectSummary(player, COMPANION_CONFIG, trainingAction, "actionTime")} />
                            </Flex>}>
                            {formatActionValue(durationMs / 1000)}s
                        </Badge>
                        <Badge variant="transparent" interactive icon={OTHER_ICONS.COINS}
                            tooltip={<Flex direction="column" gap={8}>
                                <Heading h="4" className="w-100 align-center">
                                    Coins consumed each time this action completes.
                                </Heading>
                                <EffectStack title="Gold cost effects" icon={OTHER_ICONS.COINS}
                                    entries={actionEffectStacks.baseGoldCost ?? []}
                                    summary={getActionEffectSummary(player, COMPANION_CONFIG, trainingAction, "baseGoldCost")} />
                            </Flex>}>
                            {trainingCost.toLocaleString()} Coins
                        </Badge>
                        <Badge variant="transparent" interactive icon={OTHER_ICONS.SPARKLES}
                            tooltip={<Flex direction="column" gap={8}>
                                <Heading h="4" className="w-100 align-center">
                                    XP gained upon completing this action.
                                </Heading>
                                <Text size="small">
                                    Every assigned companion below the level cap gains the same XP amount.
                                </Text>
                                <hr />
                                <EffectStack title="XP effects" icon={OTHER_ICONS.SPARKLES}
                                    entries={actionEffectStacks.xpGain ?? []}
                                    summary={getActionEffectSummary(player, COMPANION_CONFIG, trainingAction, "xpGain")} />
                            </Flex>}>
                            +{formatActionValue(actionXPReward)} XP
                        </Badge>
                    </Flex>
                    <Flex align="center" gap={8}>
                        <CompanionTrainingProgress
                            skillId={skillId}
                            actionId={trainingAction.id}
                            isActive={isActive}
                            durationMs={durationMs}
                        />
                        <Button
                            variant="companions"
                            size="medium"
                            disabled={!isActive && !canStart}
                            toggled={isActive}
                            onClick={() => {
                                if (isActive) stopAction(skillId, trainingAction.id)
                                else startAction(skillId, trainingAction.id)
                            }}
                        >
                            {isActive ? "Stop" : "Start"}
                        </Button>
                    </Flex>
                </Flex>
            </Paper>

            <Paper layer={0}>
                <Flex direction="column" gap={12}>
                    <Heading h="2">Companion Slots</Heading>
                    <Flex className="companion-slot-grid" gap={12}>
                        {SLOT_IDS.map(slotId => {
                            const slot = COMPANION_CONFIG.slots[slotId]
                            const companionId = activeSlots[slotId]
                            const companion = COMPANION_DATA.find(entry => entry.id === companionId)
                            return (
                                <CompanionSlotCard
                                    key={slotId}
                                    slotId={slotId}
                                    slot={slot}
                                    companion={companion}
                                    unlocked={unlockedSlots.has(slotId)}
                                    player={player}
                                    onUnlock={() => unlockCompanionSlot(slotId)}
                                    onChoose={() => setSelectionSlotId(slotId)}
                                />
                            )
                        })}
                    </Flex>
                </Flex>
            </Paper>

            <Paper layer={0}>
                <Flex direction="column" gap={12}>
                    <Flex justify="space-between" align="center">
                        <Heading h="2">Companion Collection</Heading>
                        <Badge variant="transparent">
                            {ownedCompanions.length} / {COMPANION_DATA.length}
                        </Badge>
                    </Flex>
                    {ownedCompanions.length > 0 ? (
                        <Flex className="companion-collection-grid" wrap gap={12}>
                            {ownedCompanions.map(companion => (
                                <CompanionCollectionCard
                                    key={companion.id}
                                    companion={companion}
                                    player={player}
                                    assigned={assignedIds.has(companion.id)}
                                />
                            ))}
                        </Flex>
                    ) : (
                        <Text size="small">Unveil companion containers to discover companions.</Text>
                    )}
                </Flex>
            </Paper>

            <CompanionSelectionModal
                slotId={selectionSlotId}
                slotLabel={selectionSlot?.name ?? "Any Element"}
                variant={selectionSlot?.element ?? "companions"}
                companions={selectableCompanions}
                selectedCompanionId={selectionSlotId ? activeSlots[selectionSlotId] : null}
                onSelect={companionId => selectCompanion(selectionSlotId, companionId)}
                onClose={() => setSelectionSlotId(null)}
            />
        </Flex>
    )
}
