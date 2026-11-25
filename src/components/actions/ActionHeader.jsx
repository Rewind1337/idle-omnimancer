import { Flex } from "../Flex"
import { cx, formatCompactNumber } from "../../utility/helpers"
import { Badge } from "../Badge"
import { OTHER_ICONS } from "../../data/iconLibrary"
import { EffectStack } from "../EffectStack"
import { Heading } from "../Heading"
import { Text } from "../Text"

const formatXP = formatCompactNumber

export function ActionHeader({
    className = "",
    tier,
    name,
    level,
    isUnlocked,
    currentXP = 0,
    neededXP = null,
    actionMilestones = [],
    actionXPTable = [],
}) {
    const nextLevels = (actionXPTable ?? [])
        .filter(entry => entry.level >= level && entry.neededXP !== null)
        .slice(0, 1)
    const progressionEntries = actionMilestones.filter(entry => entry.progression)
    const regularMilestones = actionMilestones.filter(entry => !entry.progression)

    return (
        <Flex className={cx("action-header", className)}>
            <h2>{name}</h2>
            {isUnlocked && (
                <Badge variant="transparent" interactive icon={OTHER_ICONS.SPARKLES} tooltip={<Flex direction="column">
                    <Heading h="4" className="w-100 align-center">Action XP</Heading>
                </Flex>}>
                    {neededXP === null ? "MAX LEVEL" : `${formatXP(currentXP)} / ${formatXP(neededXP)} XP`}
                </Badge>
            )}
            {isUnlocked && (
                <Badge variant="transparent" interactive icon={OTHER_ICONS.STAR} tooltip={
                    <Flex direction="column" gap={8}>
                        <Heading h="4" className="w-100 align-center">Action Progression</Heading>
                        {nextLevels.length > 0 && (
                            <Flex direction="column" gap={4}>
                                <Heading h="5">Next Action Level</Heading>
                                {nextLevels.map(entry => (
                                    <Text key={entry.level} size="small">
                                        Lv. {entry.level + 1}: {formatXP(entry.neededXP)} XP
                                    </Text>
                                ))}
                            </Flex>
                        )}
                        {progressionEntries.length > 0 && (
                            <EffectStack entries={progressionEntries} showInactive />
                        )}
                        {regularMilestones.length > 0 && (
                            <>
                                <hr />
                                <EffectStack
                                    title="Action Milestones"
                                    icon={OTHER_ICONS.STAR}
                                    entries={regularMilestones}
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
                <Heading h="4" className="w-100 align-center">Action tier</Heading>
            </Flex>}>
                Tier {tier}
            </Badge>
        </Flex>
    )
}
