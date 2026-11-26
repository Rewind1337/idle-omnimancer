import { cloneElement } from "react"

import { Badge } from "../components/Badge"
import { Button } from "../components/Button"
import { Flex } from "../components/Flex"
import { Heading } from "../components/Heading"
import { Icon } from "../components/Icon"
import { Paper } from "../components/Paper"
import { Progress } from "../components/Progress"
import { Text } from "../components/Text"
import { SkillSummary } from "../components/skills/SkillSummary"
import { TimeEnergyPanel } from "../components/TimeEnergyPanel"

import { OTHER_ICONS, SKILL_ICONS, ZEN_MEDITATION_ICONS } from "../data/iconLibrary"
import { ZEN_CONFIG } from "../data/zenConfig"
import { getActionDurationMs, getActionXPReward, getSkillMilestoneDetails, getSkillProgress } from "../game/gameEngine"
import { getActionXPTable } from "../data/skillConfig"
import { useGame, useGameZenProgress } from "../hooks/useGame"
import { humanize } from "../utility/helpers"

import "./ZenPage.scss"

const formatDuration = milliseconds => {
    const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000))
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return minutes + ":" + String(seconds).padStart(2, "0")
}

function MeditationTierCard({ action, player, selected, currentCycle, onSelect }) {
    const actionState = player.skills?.[ZEN_CONFIG.id]?.actions?.[action.id]
    const xpTable = getActionXPTable(action.id)
    const nextLevel = actionState?.level ?? 1
    const neededXP = nextLevel >= 100 ? null : xpTable?.[nextLevel - 1]?.neededXP
    const xpPercentage = neededXP > 0 ? Math.min(100, ((actionState?.xp ?? 0) / neededXP) * 100) : 100
    const actionXP = getActionXPReward(ZEN_CONFIG, action, player)
    const durationMs = getActionDurationMs(ZEN_CONFIG, action, player)
    const icon = ZEN_MEDITATION_ICONS[action.id] ?? OTHER_ICONS.MEDITATE

    return (
        <Paper layer={2} variant="zen" selected={selected} className="zen-tier-card">
            <Flex direction="row" align="center" gap={12}>
                <Paper round layer={0} variant="zen" padding={8} className="w-min">
                    <Icon size={48} variant="zen">
                        {cloneElement(icon, { size: 32 })}
                    </Icon>
                </Paper>
                <Flex direction="column" gap={6}>
                    <Flex direction="row" align="center" wrap>
                        <Heading h="3">{action.name}</Heading>
                        <Badge variant="zen" size="small">Tier {action.tier}</Badge>
                        {selected && <Badge variant="zen" size="small" icon={OTHER_ICONS.CHECK_CIRCLE}>Selected</Badge>}
                        {currentCycle && <Badge variant="secondary" size="small" icon={OTHER_ICONS.HOURGLASS}>Current Cycle</Badge>}
                    </Flex>
                    <Text size="small">{action.description}</Text>
                    <Flex direction="row" wrap gap={6}>
                        <Badge variant="transparent" size="small" icon={OTHER_ICONS.HOURGLASS} tooltip="Duration of one completed meditation cycle.">
                            {formatDuration(durationMs)} / cycle
                        </Badge>
                        <Badge variant="transparent" size="small" icon={OTHER_ICONS.SPARKLES} tooltip="Zen Action XP awarded when a complete cycle finishes.">
                            +{actionXP} XP
                        </Badge>
                        <Badge variant="transparent" size="small" icon={OTHER_ICONS.STAR} tooltip="Each meditation tier has its own action level and XP progression.">
                            Lv. {actionState?.level ?? 1}
                        </Badge>
                    </Flex>
                    <Flex direction="column" gap={4}>
                        <Flex direction="row" justify="space-between">
                            <Text size="xsmall">Tier Progress</Text>
                            <Text size="xsmall">{neededXP === null ? "MAX" : (actionState?.xp ?? 0) + " / " + neededXP + " XP"}</Text>
                        </Flex>
                        <Progress variant="zen" size="xsmall" corners="rounded" percentage={xpPercentage} label="" />
                    </Flex>
                    <Button
                        variant="zen"
                        size="medium"
                        className="w-100"
                        checked={selected}
                        disabled={selected}
                        onClick={() => onSelect(action.id)}
                    >
                        {selected ? "Selected Meditation" : "Choose This Tier"}
                    </Button>
                </Flex>
            </Flex>
        </Paper>
    )
}

export function ZenPage() {
    const { player, startAction, selectMeditationTier } = useGame()
    const zenProgress = useGameZenProgress()
    const skillId = ZEN_CONFIG.id
    const skillProgress = getSkillProgress(player, skillId)
    const selectedTierId = player.zen?.selectedTierId ?? ZEN_CONFIG.actions[0].id
    const selectedTier = ZEN_CONFIG.actions.find(action => action.id === selectedTierId) ?? ZEN_CONFIG.actions[0]
    const currentCycleTier = ZEN_CONFIG.actions.find(action => action.id === zenProgress.cycleTierId)
    const durationMs = ZEN_CONFIG.time.base * 1000
    const progressMs = Math.min(durationMs, zenProgress.progressMs)
    const isManuallyMeditating = player.activeAction?.skillId === skillId
    const anotherActionRunning = Boolean(player.activeAction && player.activeAction.skillId !== skillId)
    const isAutomaticallyMeditating = !player.activeAction
    const meditationProgress = Math.min(100, (progressMs / durationMs) * 100)

    return (
        <Flex direction="column" className="page-flex page-flex-zen" padding={32} gap={24}>
            <Paper layer={0}>
                <SkillSummary
                    skillId={skillId}
                    title={humanize(skillId)}
                    skillProgress={skillProgress}
                    milestones={getSkillMilestoneDetails(player, ZEN_CONFIG)}
                    variant="zen"
                    icon={
                        <Icon size={64} variant="zen" outerRunes="solid" outerShape={7} innerRunes="gap" innerShape={5}>
                            {cloneElement(SKILL_ICONS.ZEN, { size: 48 })}
                        </Icon>
                    }
                />
            </Paper>

            <Paper layer={0} className="zen-meditation-section">
                <Flex direction="column" gap={16}>
                    <Flex direction="row" align="center" gap={12}>
                        <Paper round layer={1} variant="zen" padding={8} className="w-min">
                            <Icon size={44} variant="zen">
                                {cloneElement(OTHER_ICONS.MEDITATE, { size: 32 })}
                            </Icon>
                        </Paper>
                        <Flex direction="column" gap={4}>
                            <Heading h="2">Meditate</Heading>
                            <Text size="small">A six-minute cycle awards Zen XP to its chosen tier and restores one minute of Time Energy.</Text>
                        </Flex>
                    </Flex>

                    <Flex direction="row" wrap gap={8}>
                        <Badge variant="transparent" icon={OTHER_ICONS.HOURGLASS}>6-minute cycle</Badge>
                        <Badge variant="transparent" icon={OTHER_ICONS.SPARKLES}>+60 seconds Time Energy</Badge>
                        <Badge variant="transparent" icon={OTHER_ICONS.REPEAT2}>Automatic while idle</Badge>
                    </Flex>

                    <Paper layer={1} padding={12} className="zen-cycle-panel">
                        <Flex direction="column" gap={10}>
                            <Flex direction="row" justify="space-between" align="center">
                                <Heading h="3">Current Meditation Cycle</Heading>
                                <Badge variant="zen" icon={OTHER_ICONS.HOURGLASS}>
                                    {formatDuration(durationMs - progressMs)} remaining
                                </Badge>
                            </Flex>
                            <Progress
                                variant="zen"
                                size="medium"
                                corners="rounded"
                                percentage={meditationProgress}
                                label={meditationProgress.toFixed(1) + "%"}
                                animated={isAutomaticallyMeditating || isManuallyMeditating}
                            />
                            <Flex direction="row" justify="space-between" wrap>
                                <Text size="small">{formatDuration(progressMs)} elapsed</Text>
                                <Text size="small">{currentCycleTier ? currentCycleTier.name : selectedTier.name} cycle</Text>
                            </Flex>

                            {currentCycleTier && currentCycleTier.id !== selectedTierId && (
                                <Text size="small" className="zen-cycle-note">
                                    This cycle will finish for {currentCycleTier.name}. Your selected tier, {selectedTier.name}, takes effect on the next cycle.
                                </Text>
                            )}

                            {anotherActionRunning ? (
                                <Flex direction="column" gap={8}>
                                    <Text size="small">Another active action is running. Starting Meditate will replace it; Combat and passive companion learning will continue.</Text>
                                    <Button
                                        variant="zen"
                                        size="large"
                                        className="w-100"
                                        icon={OTHER_ICONS.MEDITATE}
                                        onClick={() => startAction(skillId, selectedTierId)}
                                    >
                                        Meditate Now
                                    </Button>
                                </Flex>
                            ) : (
                                <Flex direction="row" align="center" gap={8}>
                                    <Badge variant="zen" icon={OTHER_ICONS.CHECK_CIRCLE}>
                                        {isManuallyMeditating ? "Manual Meditation Active" : "Meditating Automatically"}
                                    </Badge>
                                    <Text size="xsmall">No other active action is occupying your time.</Text>
                                </Flex>
                            )}
                        </Flex>
                    </Paper>

                    <TimeEnergyPanel inline />

                    <Flex direction="column" gap={10}>
                        <Heading h="3">Meditation Tiers</Heading>
                        <Text size="small">Choose which meditation receives XP. If a cycle is already underway, it finishes for the tier it started with.</Text>
                        <Flex direction="column" gap={10}>
                            {ZEN_CONFIG.actions.map(action => (
                                <MeditationTierCard
                                    key={action.id}
                                    action={action}
                                    player={player}
                                    selected={action.id === selectedTierId}
                                    currentCycle={action.id === zenProgress.cycleTierId}
                                    onSelect={selectMeditationTier}
                                />
                            ))}
                        </Flex>
                    </Flex>
                </Flex>
            </Paper>
        </Flex>
    )
}
