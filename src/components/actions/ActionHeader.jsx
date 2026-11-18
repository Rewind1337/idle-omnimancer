import { Flex } from "../Flex"
import { cx } from "../../utility/helpers"
import { Badge } from "../Badge"
import { OTHER_ICONS } from "../../data/iconLibrary"
import { EffectStack } from "../EffectStack"
import { Heading } from "../Heading"

export function ActionHeader({
    className = "",
    tier,
    name,
    level,
    isUnlocked,
    currentXP = 0,
    neededXP = null,
    actionMilestones = [],
}) {
    return (
        <Flex className={cx("action-header", className)}>
            <h2>{name}</h2>
            {isUnlocked && (
                <Badge variant="transparent" interactive icon={OTHER_ICONS.SPARKLES} tooltip={<Flex direction="column">
                    <Heading h="4">Current Action XP earned toward the next Action level.</Heading>
                </Flex>}>
                    {neededXP === null ? "MAX LEVEL" : `${currentXP.toFixed(1)} / ${neededXP} XP`}
                </Badge>
            )}
            {isUnlocked && (
                <Badge variant="transparent" interactive icon={OTHER_ICONS.STAR} tooltip={
                    <Flex direction="column" gap={8}>
                        <Heading h="4" className="w-100 align-center">Total progress in this Action</Heading>
                        {actionMilestones.length > 0 && (
                            <>
                                <div className="divider tooltip-divider"></div>
                                <EffectStack
                                    title="Action milestones"
                                    icon={OTHER_ICONS.STAR}
                                    entries={actionMilestones}
                                    showInactive
                                />
                            </>
                        )}
                    </Flex>
                }>
                    Lv. {level} / 100
                </Badge>
            )}
            <Badge variant="transparent" interactive icon={OTHER_ICONS.MERGE} tooltip={<Flex direction="column">
                <Heading h="4">Action tier determines its base duration, XP reward and Mana cost.</Heading>
            </Flex>}>
                Tier {tier}
            </Badge>
        </Flex>
    )
}
