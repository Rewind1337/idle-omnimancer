import { Modal } from "../Modal"
import { Heading } from "../Heading"
import { Button } from "../Button"
import { Badge } from "../Badge"
import { Flex } from "../Flex"
import { Grid } from "../Grid"
import { Paper } from "../Paper"
import { Progress } from "../Progress"
import { Text } from "../Text"
import { ActionResources } from "../actions/ActionResources"

import { CURRENCY_DATA_BY_ID, ITEM_DATA_BY_ID } from "../../data/itemData"
import { OTHER_ICONS } from "../../data/iconLibrary"
import { MISSION_DATA } from "../../data/missionData"
import { useGame } from "../../hooks/useGame"

import "./MissionsModal.scss"

function MissionCard({ mission, player, canTurnIn, onTurnIn }) {
    const requirements = mission.objective.items ?? [{
        item: mission.objective.item,
        amount: mission.objective.amount,
    }]
    const fameReward = mission.rewards
        .filter(reward => reward.currency === "currency:fame")
        .reduce((total, reward) => total + reward.amount, 0)
    const otherRewards = mission.rewards.filter(reward => reward.currency !== "currency:fame")

    return (
        <Paper layer={2} variant="secondary" className="mission-card">
            <Flex direction="column">
                <Flex direction="row" justify="space-between" align="center" gap={8}>
                    <Heading h="3">{mission.title}</Heading>
                    <Flex direction="row" justify="end" wrap gap={6}>
                        <Badge
                            variant="secondary"
                            interactive
                            icon={OTHER_ICONS.MERGE}
                            tooltip="Mission tier determines the Fame awarded for completing a mission. Tier 1 grants 1 Fame, Tier 2 grants 2 Fame, and so on."
                        >
                            Tier {mission.tier}
                        </Badge>
                        {fameReward > 0 && (
                            <Badge variant="secondary" icon={CURRENCY_DATA_BY_ID["currency:fame"]?.icon}>
                                +{fameReward.toLocaleString()} Fame
                            </Badge>
                        )}
                    </Flex>
                </Flex>
                <Text size="small">{mission.description}</Text>
                <ActionResources
                    requires={requirements.map(requirement => ({
                        item: requirement.item,
                        amountLabel: (player.inventory?.[requirement.item] ?? 0).toLocaleString() +
                            " / " + requirement.amount.toLocaleString(),
                    }))}
                />
                {otherRewards.length > 0 && (
                    <Flex direction="row" justify="space-between" wrap gap={8}>
                        {otherRewards.map((reward, index) => {
                            const rewardId = reward.currency ?? reward.item
                            const rewardData = reward.currency
                                ? CURRENCY_DATA_BY_ID[reward.currency]
                                : ITEM_DATA_BY_ID[reward.item]
                            return (
                                <Badge key={rewardId + "-" + index} variant="secondary" icon={rewardData?.icon}>
                                    +{reward.amount.toLocaleString()} {rewardData?.name ?? rewardId}
                                </Badge>
                            )
                        })}
                    </Flex>
                )}
                <Button
                    variant="secondary"
                    className="w-100"
                    disabled={!canTurnIn}
                    onClick={onTurnIn}
                >
                    Turn In
                </Button>
            </Flex>
        </Paper>
    )
}

export function MissionsModal({ visible, setVisible }) {
    const { player, turnInMission } = useGame()
    const close = () => setVisible(false)

    // The mission list and its affordability checks are only needed while open.
    if (!visible) return null

    const missionTier = Math.max(1, Math.floor(player.missionTier ?? MISSION_DATA.startingTier))
    const completedMissionIds = new Set(player.completedMissions ?? [])
    const currentTierMissions = MISSION_DATA.missions.filter(mission => mission.tier === missionTier)
    const completedCount = currentTierMissions.filter(mission => completedMissionIds.has(mission.id)).length
    const requiredCount = MISSION_DATA.tierRequirements[missionTier - 1] ?? null
    const progressPercentage = requiredCount
        ? Math.min(100, completedCount / requiredCount * 100)
        : 100
    const availableTierMissions = MISSION_DATA.missions.filter(mission => mission.tier <= missionTier)
    const availableMissions = availableTierMissions.filter(mission => !completedMissionIds.has(mission.id))
    const completedMissionsCount = availableTierMissions.length - availableMissions.length
    const fame = CURRENCY_DATA_BY_ID["currency:fame"]
    const fameBalance = player.currencies?.fame ?? 0

    return (
        <Modal
            visible={visible}
            variant="secondary"
            className="modal-missions"
            onBackdropClick={close}
            header={
                <Flex direction="column" align="stretch" gap={12}>
                    <Paper layer={2} variant="secondary" className="mission-tier-panel">
                        <Flex direction="column" align="stretch" gap={8}>
                            <Flex direction="row" justify="space-between" align="center" wrap gap={8}>
                                <Heading h="1">Missions</Heading>
                                <Heading h="3">Mission Tier {missionTier}</Heading>
                                <Flex direction="row" wrap align="end" justify="space-between" gap={6}>
                                    <Badge variant="secondary" interactive icon={fame?.icon} tooltip="Fame is earned by completing missions. Each mission grants Fame equal to its tier: Tier 1 grants 1 Fame, Tier 2 grants 2 Fame, and so on.">
                                        {fameBalance.toLocaleString()} Fame
                                    </Badge>
                                    <Badge variant="secondary" icon={OTHER_ICONS.STAR}>
                                        {completedMissionsCount.toLocaleString()} Completed Missions
                                    </Badge>
                                </Flex>
                            </Flex>
                            <Progress
                                percentage={progressPercentage}
                                label={requiredCount
                                    ? completedCount.toLocaleString() + " / " + requiredCount.toLocaleString() + " Missions Completed"
                                    : "All mission tiers unlocked"}
                                size="medium"
                                corners="rounded"
                                variant="secondary"
                            />
                        </Flex>
                    </Paper>
                </Flex>
            }
            content={
                <Flex direction="column" align="stretch" gap={12} className="missions-modal-content">
                    <Heading h="3">Available Missions: {availableMissions.length}</Heading>
                    {availableMissions.length > 0 ? (
                        <Grid
                            columns={{ xsmall: 1, small: 1, medium: 2, large: 2 }}
                            gap={12}
                            className="missions-modal-list"
                        >
                            {availableMissions.map(mission => {
                                const objective = mission.objective
                                const requirements = objective.items ?? [{
                                    item: objective.item,
                                    amount: objective.amount,
                                }]
                                const canTurnIn =
                                    mission.tier <= missionTier &&
                                    objective.type === "turnIn" &&
                                    Array.isArray(requirements) &&
                                    requirements.length > 0 &&
                                    requirements.every(requirement =>
                                        Boolean(ITEM_DATA_BY_ID[requirement.item]) &&
                                        Number.isSafeInteger(requirement.amount) &&
                                        requirement.amount > 0 &&
                                        (player.inventory?.[requirement.item] ?? 0) >= requirement.amount
                                    )

                                return (
                                    <MissionCard
                                        key={mission.id}
                                        mission={mission}
                                        player={player}
                                        canTurnIn={canTurnIn}
                                        onTurnIn={() => turnInMission(mission.id)}
                                    />
                                )
                            })}
                        </Grid>
                    ) : (
                        <Paper layer={2} variant="secondary">
                            <Text>
                                {completedMissionsCount > 0
                                    ? "All currently available missions have been completed."
                                    : "No missions have been configured for this tier yet."}
                            </Text>
                        </Paper>
                    )}
                </Flex>
            }
            footer={
                <Button variant="secondary" onClick={close}>
                    Close
                </Button>
            }
        />
    )
}
