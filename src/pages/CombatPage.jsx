import { cloneElement, useMemo } from "react"

import { Badge } from "../components/Badge"
import { Button } from "../components/Button"
import { Flex } from "../components/Flex"
import { Heading } from "../components/Heading"
import { Icon } from "../components/Icon"
import { InputSelect } from "../components/InputSelect"
import { Paper } from "../components/Paper"
import { Progress } from "../components/Progress"
import { Text } from "../components/Text"
import { HexMap } from "../components/maps/HexMap"
import { ActionHeader } from "../components/actions/ActionHeader"
import { ActionResources } from "../components/actions/ActionResources"
import { SkillSummary } from "../components/skills/SkillSummary"

import { COMBAT_CONFIG, COMBAT_ACTION_BY_AREA_ID } from "../data/combatConfig"
import { EXPLORATION_CONFIG } from "../data/explorationConfig"
import { SPELLCRAFT_CONFIG } from "../data/spellcraftConfig"
import { WORLD_AREAS, WORLD_AREA_BY_ID, WORLD_DATA } from "../data/worldData"
import { ITEM_DATA_BY_ID } from "../data/itemData"
import { SKILL_ICONS } from "../data/iconLibrary"
import { getActionXPTable } from "../data/skillConfig"
import {
    canStartAction,
    getCombatArtifactChance,
    getCombatOutputMultiplier,
    getCombatPlayerStats,
    getCombatXPReward,
    getSkillMilestoneDetails,
    getActionMilestoneDetails,
    getSkillProgress,
    getSkillUnlockCosts,
} from "../game/gameEngine"
import { useGame, useGameCombatSnapshot } from "../hooks/useGame"
import { humanize } from "../utility/helpers"

import "./CombatPage.scss"

const formatNumber = value => Number(value ?? 0).toLocaleString(undefined, {
    maximumFractionDigits: 1,
})
const formatSeconds = milliseconds =>
    Math.max(0, Number(milliseconds ?? 0) / 1000).toFixed(1) + "s"

const getRewardItemId = reward =>
    typeof reward === "string" ? reward : reward?.item

const getRewardResources = (player, action) =>
    (action.rewards ?? []).flatMap(reward => {
        const itemId = getRewardItemId(reward)
        const itemData = ITEM_DATA_BY_ID[itemId]
        if (!itemData) return []

        if (itemData.type === "artifact") {
            const chance = getCombatArtifactChance(player, action)
            return chance > 0 ? [{
                item: itemId,
                amountLabel: (chance * 100).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }) + "% chance per victory",
            }] : []
        }

        return [{
            item: itemId,
            amount: typeof reward === "string" ? 1 : reward.amount ?? 1,
        }]
    })

function CombatPanel({ player, action, rotationOptions }) {
    const snapshot = useGameCombatSnapshot()
    const encounter = snapshot.encounter
    const playerState = encounter?.player
    const displayPlayer = playerState ?? getCombatPlayerStats(player, action)
    const health = playerState?.health ?? displayPlayer.maxHealth
    const maxHealth = playerState?.maxHealth ?? displayPlayer.maxHealth
    const barrier = playerState?.barrier ?? displayPlayer.barrier
    const attackIntervalMs = playerState?.attackIntervalMs ?? displayPlayer.attackIntervalMs
    const enemies = encounter?.enemies ?? []
    const currentEnemy = enemies.find(enemy => enemy.health > 0)
    const rotation = snapshot.rotation?.length ? snapshot.rotation : ["omnibolt"]
    const rotationIndex = rotation.length > 0
        ? (encounter?.rotationIndex ?? 0) % rotation.length
        : 0
    const nextAttackId = rotation[rotationIndex] ?? "omnibolt"
    const nextAttack = rotationOptions.find(option => option.value === nextAttackId)
    const phaseLabel = snapshot.phase === "fighting"
        ? (snapshot.running ? "In Combat" : "Paused")
        : snapshot.phase === "rest"
            ? "Encounter Complete"
            : snapshot.phase === "inventoryFull"
                ? "Inventory Full"
                : snapshot.running
                    ? "Preparing Encounter"
                    : "Not Started"

    return (
        <Paper layer={0} className="combat-panel">
            <Flex direction="column" align="stretch" gap={12}>
                <Flex direction="row" justify="space-between" align="center" wrap>
                    <Heading h="2">Combat Panel</Heading>
                    <Badge variant="combat">{phaseLabel}</Badge>
                </Flex>

                <Flex direction="row" wrap gap={8} className="combat-panel-summary">
                    <Badge variant="transparent">Encounters Won: {snapshot.encountersCompleted}</Badge>
                    <Badge variant="transparent">Attack Interval: {formatSeconds(attackIntervalMs)}</Badge>
                    <Badge variant="transparent">Barrier: {formatNumber(barrier)}</Badge>
                </Flex>

                <Paper layer={1} className="combatant-panel">
                    <Flex direction="column" align="stretch" gap={6}>
                        <Flex direction="row" justify="space-between" align="center">
                            <Heading h="3">You</Heading>
                            <Text size="small">{formatNumber(health)} / {formatNumber(maxHealth)} HP</Text>
                        </Flex>
                        <Progress
                            variant="combat"
                            size="small"
                            percentage={maxHealth > 0 ? Math.min(100, health / maxHealth * 100) : 0}
                            label={formatNumber(health) + " / " + formatNumber(maxHealth) + " HP"}
                        />
                        <Flex direction="row" wrap gap={8}>
                            <Badge variant="combat">Barrier {formatNumber(barrier)}</Badge>
                            <Badge variant="transparent">
                                Next Attack: {formatSeconds(playerState?.attackTimerMs ?? attackIntervalMs)}
                            </Badge>
                            <Badge variant="transparent">
                                {nextAttack?.label ?? "Omnibolt"} · {rotationIndex + 1}/{rotation.length}
                            </Badge>
                        </Flex>
                    </Flex>
                </Paper>

                <Flex direction="column" align="stretch" gap={8}>
                    <Heading h="3">Enemy Lineup</Heading>
                    {enemies.length > 0 ? enemies.map((enemy, index) => {
                        const isDefeated = enemy.health <= 0
                        return (
                            <Paper key={enemy.id ?? index} layer={1} variant={enemy.element ?? "neutral"}
                                className="combatant-panel">
                                <Flex direction="column" align="stretch" gap={6}>
                                    <Flex direction="row" justify="space-between" align="center" wrap>
                                        <Heading h="4">{enemy.name}</Heading>
                                        <Badge variant={isDefeated ? "transparent" : enemy.element ?? "neutral"}>
                                            {isDefeated
                                                ? "Defeated"
                                                : COMBAT_CONFIG.enemyArchetypes[enemy.archetype]?.label ?? humanize(enemy.archetype)}
                                            {!isDefeated && enemy.element
                                                ? " · " + humanize(enemy.element)
                                                : ""}
                                        </Badge>
                                    </Flex>
                                    <Progress
                                        variant={enemy.element ?? "combat"}
                                        size="small"
                                        percentage={enemy.maxHealth > 0
                                            ? Math.min(100, enemy.health / enemy.maxHealth * 100)
                                            : 0}
                                        label={formatNumber(enemy.health) + " / " + formatNumber(enemy.maxHealth) + " HP"}
                                    />
                                    <Flex direction="row" wrap gap={8}>
                                        <Badge variant="transparent">Damage: {formatNumber(enemy.damage)}</Badge>
                                        <Badge variant="transparent">Attack Interval: {formatSeconds(enemy.attackIntervalMs)}</Badge>
                                        {!isDefeated && (
                                            <Badge variant="transparent">Next Attack: {formatSeconds(enemy.attackTimerMs)}</Badge>
                                        )}
                                        {currentEnemy?.id === enemy.id && <Badge variant="combat">Current Target</Badge>}
                                    </Flex>
                                </Flex>
                            </Paper>
                        )
                    }) : (
                        <Text size="small">
                            {snapshot.running
                                ? "The next encounter is being prepared."
                                : "Start Combat to begin the first encounter."}
                        </Text>
                    )}
                </Flex>

                {snapshot.phase === "rest" && (
                    <Paper layer={1}>
                        <Flex direction="column" align="stretch" gap={6}>
                            <Heading h="4">Next Encounter in {formatSeconds(snapshot.cycleRemainingMs)}</Heading>
                            {snapshot.lastRewards.length > 0 ? (
                                <ActionResources produces={snapshot.lastRewards} />
                            ) : (
                                <Text size="small">No items dropped in the last encounter.</Text>
                            )}
                        </Flex>
                    </Paper>
                )}

                {snapshot.phase === "inventoryFull" && (
                    <Paper layer={1} variant="combat">
                        <Flex direction="column" align="stretch" gap={6}>
                            <Heading h="4">Make room in your Bag</Heading>
                            <Text size="small">
                                Combat has paused its next encounter until the pending reward can be added to your inventory.
                            </Text>
                            <ActionResources produces={snapshot.pendingRewards} />
                        </Flex>
                    </Paper>
                )}

                {snapshot.phase === "fighting" && (
                    <Text size="small">
                        Each living enemy attacks on its own timer. You attack the first living enemy in the lineup.
                    </Text>
                )}
            </Flex>
        </Paper>
    )
}

function CombatRotation({ player, rotation, rotationSlots, isSkillUnlocked, onChange }) {
    const spellcraftUnlocked = player.unlockedSkills?.includes(SPELLCRAFT_CONFIG.id)
    const options = [
        { value: "omnibolt", label: "Omnibolt · Neutral" },
        ...(spellcraftUnlocked
            ? SPELLCRAFT_CONFIG.actions
                .filter(spell => player.skills?.[SPELLCRAFT_CONFIG.id]?.actions?.[spell.id]?.unlocked)
                .map(spell => ({
                    value: spell.id,
                    label: (spell.name ?? humanize(spell.id.replace(/^action:/, ""))) +
                        " · " + humanize(spell.element) + " · Tier " + spell.tier,
                }))
            : []),
    ]

    return (
        <Paper layer={1} className="combat-rotation">
            <Flex direction="column" align="stretch" gap={8}>
                <Flex direction="row" justify="space-between" align="center" wrap>
                    <Heading h="3">Attack Rotation</Heading>
                    <Badge variant="transparent">
                        {rotationSlots} / {COMBAT_CONFIG.player.maxRotationSlots} Slots
                    </Badge>
                </Flex>
                {Array.from({ length: rotationSlots }, (_, index) => (
                    <InputSelect
                        key={index}
                        label={"Rotation Slot " + (index + 1)}
                        variant="combat"
                        values={options}
                        value={rotation[index] ?? ""}
                        disabled={!isSkillUnlocked}
                        onChange={value => {
                            if (!value || rotation.some((selected, selectedIndex) =>
                                selected === value && selectedIndex !== index
                            )) return
                            const next = [...rotation]
                            next[index] = value
                            onChange(next)
                        }}
                    />
                ))}
                <Text size="small">
                    Omnibolt is always available. Learned Spellcraft actions can be added to the rotation once unlocked.
                </Text>
            </Flex>
        </Paper>
    )
}

function CombatActionCard({ player, action, actionState, isSkillUnlocked, isAreaUnlocked, isRunning, canStart, onToggle }) {
    const xpTable = getActionXPTable(action.id)
    const neededXP = actionState.level >= 100
        ? null
        : xpTable?.[actionState.level - 1]?.neededXP ?? null
    const artifactChance = getCombatArtifactChance(player, action)

    return (
        <Paper layer={1} variant="combat" className="action action-combat combat-action-card">
            <Flex direction="column" align="stretch" gap={12}>
                <Flex direction="row" align="center" gap={16}>
                    <Paper round layer="0" interactive className="w-min" padding={4}>
                        <Icon size={48} variant="combat" outerRunes="wide" outerShape={7}
                            innerRunes="gap" innerShape={8}>
                            {cloneElement(SKILL_ICONS.COMBAT, { size: 48 })}
                        </Icon>
                    </Paper>
                    <Flex direction="column" align="stretch">
                        <ActionHeader
                            name={action.name}
                            level={actionState.level}
                            currentXP={actionState.xp}
                            neededXP={neededXP}
                            tier={action.tier}
                            isUnlocked={isSkillUnlocked}
                            actionXPTable={xpTable}
                            actionMilestones={isSkillUnlocked
                                ? getActionMilestoneDetails(player, COMBAT_CONFIG, action)
                                : []}
                        />
                        {isSkillUnlocked && isAreaUnlocked ? (
                            <Button
                                variant="combat"
                                size="medium"
                                className="w-100"
                                disabled={!isRunning && !canStart}
                                onClick={onToggle}
                            >
                                {isRunning ? "Pause Combat" : "Start Combat"}
                            </Button>
                        ) : (
                            <Text size="small">
                                {!isSkillUnlocked
                                    ? "Unlock Combat in the Shop to begin fighting."
                                    : "Explore this area before starting its Combat action."}
                            </Text>
                        )}
                    </Flex>
                </Flex>

                {isSkillUnlocked && (
                    <>
                        <Flex direction="row" wrap gap={8}>
                            <Badge variant="transparent">Victory XP: {formatNumber(getCombatXPReward(player, action))}</Badge>
                            <Badge variant="transparent">Artifact Chance: {(artifactChance * 100).toFixed(2)}%</Badge>
                            <Badge variant="transparent">Area Output: x{getCombatOutputMultiplier(player, action).toFixed(2)}</Badge>
                        </Flex>
                        <ActionResources produces={getRewardResources(player, action)}
                            outputMultiplier={getCombatOutputMultiplier(player, action)} />
                    </>
                )}
                {!isSkillUnlocked && (
                    <ActionResources requires={getSkillUnlockCosts(player, COMBAT_CONFIG.id)} />
                )}
            </Flex>
        </Paper>
    )
}

export function CombatPage() {
    const {
        player,
        startAction,
        stopAction,
        selectCombatArea,
        setCombatRotation,
    } = useGame()
    const skillId = COMBAT_CONFIG.id
    const skillProgress = getSkillProgress(player, skillId)
    const selectedArea = WORLD_AREA_BY_ID[player.combat?.selectedAreaId] ?? WORLD_AREAS[0]
    const selectedAction = COMBAT_ACTION_BY_AREA_ID[selectedArea.id]
    const actionState = player.skills?.[skillId]?.actions?.[selectedAction.id] ?? {
        level: 1,
        xp: 0,
        unlocked: false,
        running: false,
    }
    const isSkillUnlocked = player.unlockedSkills?.includes(skillId) ?? false
    const explorationAction = WORLD_AREA_BY_ID[selectedArea.id]?.actionId
    const isAreaUnlocked = Boolean(
        explorationAction &&
        player.skills?.[EXPLORATION_CONFIG.id]?.actions?.[explorationAction]?.unlocked
    )
    const unlockedAreaIds = useMemo(() => WORLD_AREAS
        .filter(area => Boolean(
            player.skills?.[EXPLORATION_CONFIG.id]?.actions?.[area.actionId]?.unlocked
        ))
        .map(area => area.id), [player.skills])
    const actionLevels = useMemo(() => Object.fromEntries(COMBAT_CONFIG.actions.map(action => [
        action.areaId,
        player.skills?.[skillId]?.actions?.[action.id]?.level ?? 1,
    ])), [player.skills, skillId])
    const rotationSlots = Math.max(
        COMBAT_CONFIG.player.initialRotationSlots,
        Math.min(COMBAT_CONFIG.player.maxRotationSlots, player.combat?.rotationSlots ?? 1)
    )
    const rotation = player.combat?.rotation?.length ? player.combat.rotation : ["omnibolt"]
    const rotationOptions = useMemo(() => [
        { value: "omnibolt", label: "Omnibolt" },
        ...SPELLCRAFT_CONFIG.actions
            .filter(spell => player.unlockedSkills?.includes(SPELLCRAFT_CONFIG.id) &&
                player.skills?.[SPELLCRAFT_CONFIG.id]?.actions?.[spell.id]?.unlocked)
            .map(spell => ({
                value: spell.id,
                label: spell.name ?? humanize(spell.id.replace(/^action:/, "")),
            })),
    ], [player.skills, player.unlockedSkills])
    const areaMarkers = useMemo(() => Object.fromEntries(COMBAT_CONFIG.actions.flatMap(action => {
        const artifactReward = action.rewards.find(reward =>
            ITEM_DATA_BY_ID[getRewardItemId(reward)]?.type === "artifact"
        )
        return artifactReward && (player.inventory?.[getRewardItemId(artifactReward)] ?? 0) > 0
            ? [[action.areaId, "discovered"]]
            : []
    })), [player.inventory])
    const actionIsRunning = Boolean(actionState.running)

    return (
        <Flex direction="column" className="page-flex page-flex-combat" padding={32} gap={24}>
            <Paper layer={0}>
                <SkillSummary
                    skillId={skillId}
                    title="Combat"
                    skillProgress={skillProgress}
                    milestones={getSkillMilestoneDetails(player, COMBAT_CONFIG)}
                    variant="combat"
                    progressEnabled
                    icon={
                        <Icon size={64} variant="combat" outerRunes="solid" outerShape={3}
                            innerRunes="gap" innerShape={5}>
                            {cloneElement(SKILL_ICONS.COMBAT, { size: 48 })}
                        </Icon>
                    }
                />
            </Paper>

            <Paper layer={0} className="combat-map-panel">
                <Flex direction="column" align="stretch" gap={8}>
                    <Heading h="2">The Known World</Heading>
                    <HexMap
                        areas={WORLD_AREAS}
                        mapVariant="combat"
                        startingAreaId={WORLD_DATA.map.startingAreaId}
                        selectedAreaId={selectedArea.id}
                        actionLevels={actionLevels}
                        unlockedAreaIds={unlockedAreaIds}
                        selectableAreaIds={unlockedAreaIds}
                        areaMarkers={areaMarkers}
                        onSelectArea={selectCombatArea}
                    />
                    <Text size="small">
                        Only areas already unlocked through Exploration can be selected for Combat.
                    </Text>
                </Flex>
            </Paper>

            <CombatPanel
                player={player}
                action={selectedAction}
                rotationOptions={rotationOptions}
            />

            <CombatRotation
                player={player}
                rotation={rotation}
                rotationSlots={rotationSlots}
                isSkillUnlocked={isSkillUnlocked}
                onChange={setCombatRotation}
            />

            <CombatActionCard
                player={player}
                action={selectedAction}
                actionState={actionState}
                isSkillUnlocked={isSkillUnlocked}
                isAreaUnlocked={isAreaUnlocked}
                isRunning={actionIsRunning}
                canStart={canStartAction(player, skillId, selectedAction.id)}
                onToggle={() => {
                    if (actionIsRunning) stopAction(skillId, selectedAction.id)
                    else startAction(skillId, selectedAction.id)
                }}
            />
        </Flex>
    )
}
