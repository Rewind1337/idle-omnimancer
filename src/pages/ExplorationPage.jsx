import { cloneElement, useState } from "react"

import { Badge } from "../components/Badge"
import { Flex } from "../components/Flex"
import { Heading } from "../components/Heading"
import { Icon } from "../components/Icon"
import { Paper } from "../components/Paper"
import { Text } from "../components/Text"
import { HexMap } from "../components/maps/HexMap"
import { SkillSummary } from "../components/skills/SkillSummary"

import { EXPLORATION_CONFIG } from "../data/explorationConfig"
import { WORLD_AREAS, WORLD_AREA_BY_ID, WORLD_DATA } from "../data/worldData"
import { OTHER_ICONS, SKILL_ICONS } from "../data/iconLibrary"
import { useGame } from "../hooks/useGame"
import { humanize } from "../utility/helpers"

import "./ExplorationPage.scss"

function ExplorationActionCard({ area }) {
    const action = EXPLORATION_CONFIG.actions.find(entry => entry.areaId === area.id)
    const resourceRewards = action?.produces ?? []
    const container = action?.companionContainer

    return (
        <Paper layer={1} variant={area.element ?? "exploration"} className="exploration-action-card">
            <Flex direction="column" align="stretch" gap={12}>
                <Flex direction="row" justify="space-between" wrap gap={8}>
                    <Heading h="2">{action?.name ?? area.name}</Heading>
                    <Badge variant={area.element ?? "exploration"}>
                        {area.element ? humanize(area.element) : "Neutral"} · Tier {area.tier}
                    </Badge>
                </Flex>
                <Text>{area.description}</Text>

                <Flex direction="column" align="stretch" gap={6}>
                    <Heading h="4">Exploration Rewards</Heading>
                    {resourceRewards.length > 0 ? (
                        <Flex direction="row" wrap gap={8}>
                            {resourceRewards.map(reward => (
                                <Badge key={reward.item} variant={area.element ?? "exploration"}>
                                    +{reward.amount.toLocaleString()} {humanize(reward.item.replace(/^item:/, ""))}
                                </Badge>
                            ))}
                        </Flex>
                    ) : (
                        <Text size="small">No resource rewards configured.</Text>
                    )}
                </Flex>

                {container && (
                    <Flex direction="column" align="stretch" gap={4}>
                        <Badge
                            variant={area.element ?? "exploration"}
                            icon={cloneElement(OTHER_ICONS.COMPANION_CONTAINER, { size: 20 })}
                        >
                            Companion Container
                        </Badge>
                        <Text size="small">
                            {humanize(container.item.replace(/^item:/, ""))} ·
                            {" "}{((container.baseChance ?? 0) * 100).toLocaleString()}% base chance
                            · Unveiling Level {container.minimumUnveilingSkillLevel ?? 1} required
                        </Text>
                    </Flex>
                )}

                {action?.artifactItem && (
                    <Flex direction="column" align="stretch" gap={4}>
                        <Badge
                            variant={area.element ?? "exploration"}
                            icon={cloneElement(OTHER_ICONS.ARTIFACT, { size: 20 })}
                        >
                            Combat Artifact
                        </Badge>
                        <Text size="small">
                            {humanize(action.artifactItem.replace(/^item:/, ""))}
                        </Text>
                    </Flex>
                )}

                <Text size="small" className="exploration-action-id">
                    {action?.id ?? area.actionId}
                </Text>
            </Flex>
        </Paper>
    )
}

export function ExplorationPage() {
    const [selectedAreaId, setSelectedAreaId] = useState(WORLD_DATA.map.startingAreaId)
    const { player } = useGame()
    const selectedArea = WORLD_AREA_BY_ID[selectedAreaId] ?? WORLD_AREAS[0]
    const explorationActions = player.skills?.[EXPLORATION_CONFIG.id]?.actions ?? {}
    const actionLevels = Object.fromEntries(WORLD_AREAS.map(area => [
        area.id,
        explorationActions[area.actionId]?.level ?? 1,
    ]))

    return (
        <Flex direction="column" className="page-flex page-flex-exploration" padding={32} gap={24}>
            <Paper layer={0}>
                <SkillSummary
                    title="Exploration"
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
                        startingAreaId={WORLD_DATA.map.startingAreaId}
                        selectedAreaId={selectedArea.id}
                        actionLevels={actionLevels}
                        onSelectArea={setSelectedAreaId}
                    />
                </Flex>
            </Paper>

            <ExplorationActionCard area={selectedArea} />
        </Flex>
    )
}
