import { Flex } from "../Flex"
import { cx } from "../../utility/helpers"
import { Badge } from "../Badge"
import { OTHER_ICONS } from "../../data/iconLibrary"
import { EffectStack } from "../EffectStack"
import { Heading } from "../Heading"
import { Text } from "../Text"

const formatXP = value => Number(value).toLocaleString()
const formatFormulaNumber = value => Number(value.toFixed(4)).toString()

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
    xpConfig = null,
}) {
    const nextLevels = (actionXPTable ?? [])
        .filter(entry => entry.level >= level && entry.neededXP !== null)
        .slice(0, 3)
    const baseXP = xpConfig
        ? xpConfig.base + xpConfig.perTier * (tier - 1)
        : null
    const levelMultiplier = xpConfig
        ? xpConfig.perLevelMult * Math.pow(xpConfig.perTierMult, tier - 1)
        : null
    const xpFormula = xpConfig
        ? `ceil((${formatFormulaNumber(baseXP)} × ${formatFormulaNumber(levelMultiplier)}^(level − 1) + ${formatFormulaNumber(xpConfig.perLevelFlat)} × (level − 1)) × ${formatFormulaNumber(xpConfig.finalMultPerLevel)}^(level − 1))`
        : null

    return (
        <Flex className={cx("action-header", className)}>
            <h2>{name}</h2>
            {isUnlocked && (
                <Badge variant="transparent" interactive icon={OTHER_ICONS.SPARKLES} tooltip={<Flex direction="column">
                    <Heading h="4" className="w-100 align-center">Current Action XP earned toward the next Action level.</Heading>
                </Flex>}>
                    {neededXP === null ? "MAX LEVEL" : `${currentXP.toFixed(1)} / ${neededXP} XP`}
                </Badge>
            )}
            {isUnlocked && (
                <Badge variant="transparent" interactive icon={OTHER_ICONS.STAR} tooltip={
                    <Flex direction="column" gap={8}>
                        <Heading h="4" className="w-100 align-center">Total progress in this Action</Heading>
                        {nextLevels.length > 0 && (
                            <Flex direction="column" gap={4}>
                                <Heading h="5">Next Action Levels</Heading>
                                {nextLevels.map(entry => (
                                    <Text key={entry.level} size="small">
                                        Level {entry.level + 1}: {formatXP(entry.neededXP)} XP
                                    </Text>
                                ))}
                            </Flex>
                        )}
                        {xpFormula && (
                            <Flex direction="column" gap={4}>
                                <Heading h="5">Action Level XP Growth</Heading>
                                <Text size="small">{xpFormula}</Text>
                                <Text size="small">The growth multiplier is adjusted by Action tier.</Text>
                            </Flex>
                        )}
                        {actionMilestones.length > 0 && (
                            <>
                                <hr />
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
                <Heading h="4" className="w-100 align-center">Action tier determines its base duration, XP reward and Mana cost.</Heading>
            </Flex>}>
                Tier {tier}
            </Badge>
        </Flex>
    )
}
