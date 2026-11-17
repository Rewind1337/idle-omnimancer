import { Flex } from "../Flex"
import { cx } from "../../utility/helpers"

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
            {isUnlocked && <h4 className="align-left">Lv. {level} / 100</h4>}
            <h3 className="align-right">Tier {tier} {skillName}</h3>
        </Flex>
    )
}
