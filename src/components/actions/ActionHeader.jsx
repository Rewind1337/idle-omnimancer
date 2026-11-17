import { Flex } from "../Flex"
import { cx } from "../../utility/helpers"
import { Badge } from "../Badge"

export function ActionHeader({
    className = "",
    tier,
    name,
    level,
    isUnlocked,
    skillName = "Research",
}) {
    return (
        <Flex className={cx("action-header", className)}>
            <h2>{name}</h2>
            {isUnlocked && <Badge variant={skillName.toLowerCase()} interactive>Lv. {level} / 100</Badge>}
            <Badge variant={skillName.toLowerCase()} interactive>Tier {tier} {skillName}</Badge>
        </Flex>
    )
}
