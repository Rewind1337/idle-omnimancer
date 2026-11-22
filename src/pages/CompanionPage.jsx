import { useState } from "react"

import { Badge } from "../components/Badge"
import { Button } from "../components/Button"
import { Flex } from "../components/Flex"
import { Heading } from "../components/Heading"
import { Icon } from "../components/Icon"
import { Paper } from "../components/Paper"
import { Progress } from "../components/Progress"
import { SkillSummary } from "../components/skills/SkillSummary"
import { Text } from "../components/Text"
import { CompanionSelectionModal } from "../components/modals/CompanionSelectionModal"

import { COMPANION_CONFIG } from "../data/companionConfig"
import { COMPANION_DATA } from "../data/companionData"
import { ITEM_DATA_BY_ID } from "../data/itemData"
import { OTHER_ICONS, SKILL_ICONS } from "../data/iconLibrary"
import {
    canStartAction,
    getActionDurationMs,
    getActionProgress,
    getActiveCompanionIds,
    getTrainableActiveCompanionIds,
    getCompanionLevelProgress,
    getCompanionSlotUnlockCost,
    getSkillProgress,
} from "../game/gameEngine"
import { useGame } from "../hooks/useGame"

import "./CompanionPage.scss"

const ELEMENTS = ["earth", "air", "water"]
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
    const growth = Math.max(0, level - 1) * perLevel
    const multiplier = effect === "manaCost" || effect === "unlockCostReduction"
        ? Math.max(0.1, 1 - growth)
        : 1 + growth
    return "x" + multiplier.toFixed(2)
}

function CompanionSlotCard({
    element,
    companion,
    unlocked,
    player,
    onUnlock,
    onChoose,
}) {
    const unlockCost = getCompanionSlotUnlockCost(player, element)
    const companionProgress = companion
        ? getCompanionLevelProgress(player, companion.id)
        : null
    const container = companion ? ITEM_DATA_BY_ID[companion.containerId] : null

    return (
        <Paper layer={1} variant={element} className="companion-slot-card">
            <Flex direction="column" gap={12}>
                <Flex justify="space-between">
                    <Heading h="2">{element.charAt(0).toUpperCase() + element.slice(1)} Slot</Heading>
                    {unlocked
                        ? <Badge variant={element}>Unlocked</Badge>
                        : <Badge variant="transparent">Locked</Badge>}
                </Flex>
                {!unlocked ? (
                    <>
                        <Text size="small">Unlock this slot to actively tend to an {element} companion.</Text>
                        <Button
                            variant={element}
                            size="medium"
                            disabled={(player.currencies?.coins ?? 0) < unlockCost}
                            onClick={onUnlock}
                        >
                            Unlock · {unlockCost.toLocaleString()} Coins
                        </Button>
                    </>
                ) : (
                    <>
                        {companion ? (
                            <Flex direction="column" align="center" gap={6} className="companion-slot-selected">
                                <Icon size={64} variant={element}>{container?.icon}</Icon>
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
                                <Progress
                                    layer={2}
                                    size="small"
                                    variant={element}
                                    percentage={companionProgress.neededXP
                                        ? companionProgress.xp / companionProgress.neededXP * 100
                                        : 100}
                                />
                            </Flex>
                        ) : (
                            <Flex align="center" justify="center" className="companion-slot-empty">
                                <Icon size={56} variant={element}>
                                    {ITEM_DATA_BY_ID[
                                        element === "earth" ? "item:earth_geode_i" :
                                            element === "air" ? "item:air_egg_i" : "item:water_shell_i"
                                    ].icon}
                                </Icon>
                                <Text size="small">No companion selected</Text>
                            </Flex>
                        )}
                        <Button variant={element} size="medium" onClick={onChoose}>
                            {companion ? "Choose / Switch Companion" : "Choose Companion"}
                        </Button>
                    </>
                )}
            </Flex>
        </Paper>
    )
}

function CompanionCollectionCard({ companion, player, assigned }) {
    const progress = getCompanionLevelProgress(player, companion.id)
    const permanentValue = getEffectValue(
        companion.permanentEffect.effect,
        companion.permanentEffect.perLevel,
        progress.level
    )
    const activeValue = getEffectValue(
        companion.activeEffect.effect,
        companion.activeEffect.perLevel,
        progress.level
    )
    const targetSkill = SKILL_NAMES[companion.activeEffect.targetSkillId] ??
        companion.activeEffect.targetSkillId.replace("skill:", "")

    return (
        <Paper layer={1} variant={companion.element} className="companion-collection-card">
            <Flex direction="column" gap={8}>
                <Flex align="center" gap={10}>
                    <Icon size={40} variant={companion.element}>
                        {ITEM_DATA_BY_ID[companion.containerId]?.icon}
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
                <Progress
                    layer={2}
                    size="small"
                    variant={companion.element}
                    percentage={progress.neededXP
                        ? progress.xp / progress.neededXP * 100
                        : 100}
                />
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
    const {
        player,
        startAction,
        stopAction,
        unlockCompanionSlot,
        selectCompanion,
    } = useGame()
    const skillId = COMPANION_CONFIG.id
    const trainingAction = COMPANION_CONFIG.actions[0]
    const skillProgress = getSkillProgress(player, skillId)
    const actionState = player.skills?.[skillId]?.actions?.[trainingAction.id] ?? {
        level: 1, xp: 0, progressMs: 0, unlocked: false,
    }
    const isActive = player.activeAction?.skillId === skillId &&
        player.activeAction?.actionId === trainingAction.id
    const activeCompanionIds = getActiveCompanionIds(player)
    const trainableCompanionIds = getTrainableActiveCompanionIds(player)
    const durationMs = getActionDurationMs(COMPANION_CONFIG, trainingAction, player)
    const canStart = canStartAction(player, skillId, trainingAction.id)
    const progress = getActionProgress(actionState, durationMs)
    const unlockedSlots = new Set(player.unlockedCompanionSlots ?? ["earth"])
    const activeSlots = player.activeCompanionSlots ?? { earth: null, air: null, water: null }
    const [selectionElement, setSelectionElement] = useState(null)

    const selectableCompanions = selectionElement
        ? COMPANION_DATA.filter(companion =>
            companion.element === selectionElement &&
            player.unlockedCompanions?.includes(companion.id)
        )
        : []
    const assignedIds = new Set(Object.values(activeSlots).filter(Boolean))
    const ownedCompanions = COMPANION_DATA.filter(companion =>
        player.unlockedCompanions?.includes(companion.id)
    )

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
                    skillXPTooltip="Companion skill XP is derived from the combined levels of all 15 companions."
                    totalProgressTooltip="Total progress is the sum of all companion levels, for a maximum of 1,500 levels."
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
                    <Flex justify="space-between" align="center">
                        <Heading h="2">Tend to Companions</Heading>
                        <Badge variant="transparent">No action levels</Badge>
                    </Flex>
                    <Flex wrap gap={8}>
                        <Badge variant="transparent" icon={OTHER_ICONS.HOURGLASS}>
                            {durationMs / 1000}s
                        </Badge>
                        <Badge variant="transparent" icon={OTHER_ICONS.COINS}>20 Coins</Badge>
                        <Badge variant="transparent">+5 XP per trainable active companion</Badge>
                    </Flex>
                    <Flex align="center" gap={8}>
                        <Progress
                            className="companion-training-progress"
                            layer={2}
                            size="medium"
                            variant="companions"
                            percentage={isActive ? progress : 0}
                            animated={isActive}
                        />
                        <Button
                            variant="companions"
                            size="medium"
                            disabled={!isActive && !canStart}
                            toggled={isActive}
                            badge={isActive ? progress.toFixed(0) + "%" : null}
                            onClick={() => {
                                if (isActive) stopAction(skillId, trainingAction.id)
                                else startAction(skillId, trainingAction.id)
                            }}
                        >
                            {isActive ? "Stop" : "Start"}
                        </Button>
                    </Flex>
                    <Text size="small">
                        Each completed cycle costs 20 Coins and grants 5 XP to every selected companion.
                        {trainableCompanionIds.length > 0
                            ? " " + trainableCompanionIds.length + " active companion" +
                                (trainableCompanionIds.length === 1 ? " will" : "s will") + " receive XP."
                            : activeCompanionIds.length > 0
                                ? " All active companions are at maximum level."
                                : " Select at least one companion to begin training."}
                    </Text>
                </Flex>
            </Paper>

            <Paper layer={0}>
                <Flex direction="column" gap={12}>
                    <Heading h="2">Companion Slots</Heading>
                    <Flex className="companion-slot-grid" gap={12} wrap>
                        {ELEMENTS.map(element => {
                            const companionId = activeSlots[element]
                            const companion = COMPANION_DATA.find(entry => entry.id === companionId)
                            return (
                                <CompanionSlotCard
                                    key={element}
                                    element={element}
                                    companion={companion}
                                    unlocked={unlockedSlots.has(element)}
                                    player={player}
                                    onUnlock={() => unlockCompanionSlot(element)}
                                    onChoose={() => setSelectionElement(element)}
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
                element={selectionElement}
                companions={selectableCompanions}
                selectedCompanionId={selectionElement ? activeSlots[selectionElement] : null}
                onSelect={companionId => selectCompanion(selectionElement, companionId)}
                onClose={() => setSelectionElement(null)}
            />
        </Flex>
    )
}
