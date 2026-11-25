import { Badge } from "../Badge"
import { Flex } from "../Flex"
import { Paper } from "../Paper"
import { Progress } from "../Progress"
import { OTHER_ICONS } from "../../data/iconLibrary"
import { Heading } from "../Heading"
import { Text } from "../Text"
import { EffectStack } from "../EffectStack"
import { getSkillXPTable } from "../../data/skillConfig"
import { formatCompactNumber } from "../../utility/helpers"

const formatXP = formatCompactNumber

export function SkillSummary({
    title,
    skillId,
    skillProgress,
    variant,
    icon,
    milestones = [],
    progressionMilestones = [],
    progressEnabled = true,
    skillXPTooltip = "Skill XP",
    totalProgressTooltip = "Skill progression",
}) {
    const totalPercentage = progressEnabled && skillProgress?.maxXP > 0
        ? (skillProgress.totalXP / skillProgress.maxXP) * 100
        : 0
    const levelPercentage = progressEnabled && skillProgress?.neededXP > 0
        ? (skillProgress.xp / skillProgress.neededXP) * 100
        : 100
    const nextSkillLevels = progressEnabled && skillId
        ? (getSkillXPTable(skillId) ?? [])
            .filter(entry => entry.level >= skillProgress.level && entry.neededXP !== null)
            .slice(0, 1)
        : []

    return (
        <Paper className="skill-summary" layer={1} variant={variant} padding={16}>
            <Flex direction="row" gap={32}>
                <Paper round layer="0" interactive className="w-min" padding={16}>
                    {icon}
                </Paper>
                <Flex direction="column">
                    <Flex>
                        <h1>{title}</h1>
                        {progressEnabled && (
                            <Badge variant="transparent" interactive icon={OTHER_ICONS.SPARKLES} tooltip={<Flex direction="column">
                                <Heading h="4" className="w-100 align-center">{skillXPTooltip}</Heading>
                            </Flex>}>
                                {skillProgress.xp} / {skillProgress.neededXP} XP
                            </Badge>
                        )}
                        <Badge variant="transparent" interactive icon={OTHER_ICONS.STAR} tooltip={
                            <Flex direction="column" gap={8}>
                                {progressEnabled ? (
                                    <>
                                        <Heading h="4" className="w-100 align-center">Skill Progression</Heading>
                                        {nextSkillLevels.length > 0 && (
                                            <Flex direction="column" gap={4}>
                                                <Heading h="5">Next Skill Level</Heading>
                                                {nextSkillLevels.map(entry => (
                                                    <Text key={entry.level} size="small">
                                                        Lv. {entry.level + 1}: {formatXP(entry.neededXP)} Skill XP
                                                    </Text>
                                                ))}
                                            </Flex>
                                        )}
                                    </>
                                ) : (
                                    <Heading h="4" className="w-100 align-center">Skill progression unavailable.</Heading>
                                )}
                                {progressionMilestones.length > 0 && (
                                    <EffectStack
                                        entries={progressionMilestones}
                                        showInactive
                                    />
                                )}
                                {milestones.length > 0 && (
                                    <>
                                        <div className="divider tooltip-divider"></div>
                                        <EffectStack
                                            title="Skill Milestones"
                                            icon={OTHER_ICONS.STAR}
                                            entries={milestones}
                                            showInactive
                                        />
                                    </>
                                )}
                            </Flex>
                        }>
                            {progressEnabled ? `Level ${skillProgress.level} / 100` : "Preview"}
                        </Badge>
                    </Flex>
                    {progressEnabled && (
                        <Flex className="skill-progress" direction="column" gap={4}>
                            <Heading h="3">Progress to next Level</Heading>
                            <Progress corners="rounded" variant={variant} percentage={levelPercentage} />
                            <hr style={{ marginBlock: 8, borderColor: "transparent" }} />
                            <Heading h="3">Total Skill Progress</Heading>
                            <Progress corners="rounded" variant={variant} percentage={totalPercentage} />
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Paper>
    )
}
