import { cloneElement } from "react"

import { Flex } from "./Flex"
import { Paper } from "./Paper"
import { Icon } from "./Icon"
import { Progress } from "./Progress"

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
                    <Icon size={64} variant={variant} outerRunes="solid" outerShape={3}
                        innerRunes="gap" innerShape={3}>
                        {cloneElement(icon, { size: 48 })}
                    </Icon>
                </Paper>
                <Flex direction="column">
                    <Flex>
                        <h1>{title}</h1>
                        <h3 className="align-right">Level {skillProgress.level} / 100</h3>
                    </Flex>
                    <Flex className="skill-progress" direction="column" gap={4}>
                        <Progress size="small" variant={variant} percentage={totalPercentage} />
                        <Progress variant={variant} percentage={levelPercentage} />
                    </Flex>
                </Flex>
            </Flex>
        </Paper>
    )
}
