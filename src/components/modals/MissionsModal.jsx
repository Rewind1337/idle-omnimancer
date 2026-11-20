import { Modal } from "../Modal"
import { Heading } from "../Heading"
import { Button } from "../Button"
import { Badge } from "../Badge"
import { Flex } from "../Flex"
import { Grid } from "../Grid"
import { Item } from "../Item"
import { Paper } from "../Paper"
import { Progress } from "../Progress"
import { Text } from "../Text"

import { CURRENCY_DATA_BY_ID, ITEM_DATA_BY_ID } from "../../data/itemData"
import { MISSION_DATA } from "../../data/missionData"
import { useGame } from "../../hooks/useGame"

import "./MissionsModal.scss"

function MissionCard({ mission, player, isCompleted, canTurnIn, onTurnIn }) {
    const objectiveItem = ITEM_DATA_BY_ID[mission.objective.item]
    const ownedAmount = player.inventory?.[mission.objective.item] ?? 0

    return (
        <Paper layer={2} variant="secondary" className="mission-card">
            <Flex direction="column" align="stretch" gap={10}>
                <Flex direction="row" justify="space-between" wrap gap={8}>
                    <Heading h="4">{mission.title}</Heading>
                    <Flex direction="row" gap={6} wrap>
                        <Badge variant="secondary">Tier {mission.tier}</Badge>
                        {isCompleted && <Badge variant="secondary">Completed</Badge>}
                    </Flex>
                </Flex>
                <Text size="small">{mission.description}</Text>
                <Flex direction="row" justify="space-between" wrap gap={8}>
                    <Item
                        mode="wide"
                        layer={2}
                        interactive={false}
                        icon={objectiveItem?.icon}
                        name={mission.objective.amount.toLocaleString() + " × " + (objectiveItem?.name ?? mission.objective.item)}
                        variant={objectiveItem?.variant ?? "primary"}
                    />
                    {mission.rewards.map((reward, index) => {
                        const rewardId = reward.currency ?? reward.item
                        const rewardData = reward.currency
                            ? CURRENCY_DATA_BY_ID[reward.currency]
                            : ITEM_DATA_BY_ID[reward.item]
                        return (
                            <Badge
                                key={rewardId + "-" + index}
                                variant="secondary"
                                icon={rewardData?.icon}
                            >
                                +{reward.amount.toLocaleString()} {rewardData?.name ?? rewardId}
                            </Badge>
                        )
                    })}
                </Flex>
                <Flex direction="row" justify="space-between" align="center" wrap gap={8}>
                    <Text size="small">
                        {ownedAmount.toLocaleString()} / {mission.objective.amount.toLocaleString()} available
                    </Text>
                    <Button
                        variant="secondary"
                        size="small"
                        disabled={!canTurnIn}
                        onClick={onTurnIn}
                    >
                        {isCompleted ? "Completed" : "Turn In"}
                    </Button>
                </Flex>
            </Flex>
        </Paper>
    )
}

export function MissionsModal({ visible, setVisible }) {
    const { player, turnInMission } = useGame()
    const close = () => setVisible(false)

    const missionTier = Math.max(1, Math.floor(player.missionTier ?? MISSION_DATA.startingTier))
    const completedMissionIds = new Set(player.completedMissions ?? [])
    const currentTierMissions = MISSION_DATA.missions.filter(mission => mission.tier === missionTier)
    const completedCount = currentTierMissions.filter(mission => completedMissionIds.has(mission.id)).length
    const requiredCount = MISSION_DATA.tierRequirements[missionTier - 1] ?? null
    const progressPercentage = requiredCount
        ? Math.min(100, completedCount / requiredCount * 100)
        : 100
    const availableMissions = MISSION_DATA.missions.filter(mission => mission.tier <= missionTier)
    const fame = CURRENCY_DATA_BY_ID["currency:fame"]
    const fameBalance = player.currencies?.fame ?? 0

    return (
        <Modal
            visible={visible}
            variant="secondary"
            className="modal-missions"
            onBackdropClick={close}
            header={
                <Flex direction="row" justify="space-between" wrap gap={12}>
                    <Heading h="1">Missions</Heading>
                    <Badge variant="secondary" icon={fame?.icon}>
                        {fameBalance.toLocaleString()} Fame
                    </Badge>
                </Flex>
            }
            content={
                <Flex direction="column" align="stretch" gap={12} className="missions-modal-content">
                    <Paper layer={2} variant="secondary" className="mission-tier-panel">
                        <Flex direction="column" align="stretch" gap={8}>
                            <Flex direction="row" justify="space-between" wrap gap={8}>
                                <Heading h="3">Mission Tier {missionTier}</Heading>
                                <Badge variant="secondary">
                                    {requiredCount
                                        ? completedCount.toLocaleString() + " / " + requiredCount.toLocaleString()
                                        : "Maximum Tier"}
                                </Badge>
                            </Flex>
                            <Progress
                                percentage={progressPercentage}
                                label={requiredCount
                                    ? completedCount.toLocaleString() + " / " + requiredCount.toLocaleString() + " Missions Completed"
                                    : "All mission tiers unlocked"}
                                size="small"
                                variant="secondary"
                            />
                            <Text size="small">
                                {requiredCount
                                    ? "Complete " + requiredCount.toLocaleString() + " missions from this tier to unlock Mission Tier " + (missionTier + 1) + "."
                                    : "You have reached the highest configured mission tier."}
                            </Text>
                        </Flex>
                    </Paper>
                    <Heading h="3">Available Missions</Heading>
                    {availableMissions.length > 0 ? (
                        <Grid
                            columns={{ xsmall: 1, small: 1, medium: 2, large: 2 }}
                            gap={12}
                            className="missions-modal-list"
                        >
                            {availableMissions.map(mission => {
                                const isCompleted = completedMissionIds.has(mission.id)
                                const objective = mission.objective
                                const ownedAmount = player.inventory?.[objective.item] ?? 0
                                const canTurnIn = !isCompleted &&
                                    mission.tier <= missionTier &&
                                    objective.type === "turnIn" &&
                                    Boolean(ITEM_DATA_BY_ID[objective.item]) &&
                                    Number.isSafeInteger(objective.amount) &&
                                    objective.amount > 0 &&
                                    ownedAmount >= objective.amount

                                return (
                                    <MissionCard
                                        key={mission.id}
                                        mission={mission}
                                        player={player}
                                        isCompleted={isCompleted}
                                        canTurnIn={canTurnIn}
                                        onTurnIn={() => turnInMission(mission.id)}
                                    />
                                )
                            })}
                        </Grid>
                    ) : (
                        <Paper layer={2} variant="secondary">
                            <Text>No missions have been configured for this tier yet.</Text>
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
