import { Flex } from "../Flex"
import { cx } from "../../utility/helpers"
import { Badge } from "../Badge"
import { OTHER_ICONS } from "../../data/iconLibrary"

export function ActionHeader({
    className = "",
    tier,
    name,
    level,
    isUnlocked,
    currentXP = 0,
    neededXP = null,
    skillName = "Research",
}) {
    return (
        <Flex className={cx("action-header", className)}>
            <h2>{name}</h2>
            {isUnlocked && (
                <Badge variant={skillName.toLowerCase()} interactive icon={OTHER_ICONS.SPARKLES}>
                    {neededXP === null ? "MAX LEVEL" : `${currentXP.toFixed(1)} / ${neededXP} XP`}
                </Badge>
            )}
            {isUnlocked && (
                <Badge variant={skillName.toLowerCase()} interactive icon={OTHER_ICONS.STAR}>
                    Lv. {level} / 100
                </Badge>
            )}
            <Badge variant={skillName.toLowerCase()} interactive icon={OTHER_ICONS.MERGE}>
                Tier {tier}
            </Badge>
        </Flex>
    )
}
