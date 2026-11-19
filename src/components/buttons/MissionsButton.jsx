import { MISSION_DATA } from "../../data/missionData"
import { OTHER_ICONS } from "../../data/iconLibrary"
import { useGame } from "../../hooks/useGame"
import { Button } from "../Button"

export function MissionsButton({ active = false, onClick }) {
    const { player } = useGame()
    const missionTier = Math.max(1, Math.floor(player.missionTier ?? MISSION_DATA.startingTier))
    const tierMissions = MISSION_DATA.missions.filter(mission => mission.tier === missionTier)
    const completedCount = tierMissions.filter(mission =>
        player.completedMissions?.includes(mission.id)
    ).length
    const requiredCount = MISSION_DATA.tierRequirements[missionTier - 1]
    const progress = requiredCount
        ? completedCount.toLocaleString() + " / " + requiredCount.toLocaleString()
        : "MAX"

    return (
        <Button
            size="medium"
            variant="secondary"
            className="w-min"
            checked={active}
            icon={OTHER_ICONS.MISSIONS}
            badge={progress}
            badgeIcon={OTHER_ICONS.STAR}
            onClick={onClick}
        >
            Missions
        </Button>
    )
}
