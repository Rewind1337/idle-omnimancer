import { Badge } from "../Badge"
import { Flex } from "../Flex"
import { Paper } from "../Paper"
import { Progress } from "../Progress"
import { OTHER_ICONS } from "../../data/iconLibrary"
import { Heading } from "../Heading"

export function SkillSummary({ title, skillProgress, variant, icon }) {
    const totalPercentage = skillProgress.maxXP > 0
        ? (skillProgress.totalXP / skillProgress.maxXP) * 100
        : 0
    const levelPercentage = skillProgress.neededXP > 0
        ? (skillProgress.xp / skillProgress.neededXP) * 100
        : 100

    return (
        <Paper className="skill-summary" layer={1} variant={variant} padding={16}>
            <Flex direction="row" gap={32}>
                <Paper round layer="0" interactive className="w-min" padding={16}>
                    {icon}
                </Paper>
                <Flex direction="column">
                    <Flex>
                        <h1>{title}</h1>
                        <Badge variant="transparent" interactive icon={OTHER_ICONS.SPARKLES} tooltip={<Flex direction="column">Action levels needed for the next Skill level</Flex>}>
                            {skillProgress.xp} / {skillProgress.neededXP} XP
                        </Badge>
                        <Badge variant="transparent" interactive icon={OTHER_ICONS.STAR} tooltip={<Flex direction="column">Total Progress in this Skill.</Flex>}>
                            Level {skillProgress.level} / 100
                        </Badge>
                    </Flex>
                    <Flex className="skill-progress" direction="column" gap={4}>
                        <Heading h="3">Total Skill Progress</Heading>
                        <Progress corners="rounded" variant={variant} percentage={totalPercentage} />
                        <hr style={{ marginBlock: 8, borderColor: "transparent" }} />
                        <Heading h="3">Progress to next Level</Heading>
                        <Progress corners="rounded" variant={variant} percentage={levelPercentage} />
                    </Flex>
                </Flex>
            </Flex>
        </Paper>
    )
}
