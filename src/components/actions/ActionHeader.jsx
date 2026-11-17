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
}) {
    return (
        <Flex className={cx("action-header", className)}>
            <h2>{name}</h2>
            {isUnlocked && (
                <Badge variant="transparent" interactive icon={OTHER_ICONS.SPARKLES} tooltip={<Flex direction="column">Action XP needed for the next Action level</Flex>}>
                    {neededXP === null ? "MAX LEVEL" : `${currentXP.toFixed(1)} / ${neededXP} XP`}
                </Badge>
            )}
            {isUnlocked && (
                <Badge variant="transparent" interactive icon={OTHER_ICONS.STAR} tooltip={<Flex direction="column">Total Progress in this Action.</Flex>}>
                    Lv. {level} / 100
                </Badge>
            )}
            <Badge variant="transparent" interactive icon={OTHER_ICONS.MERGE} tooltip={<Flex direction="column">The "Difficulty" of the Action</Flex>}>
                Tier {tier}
            </Badge>
        </Flex>
    )
}
