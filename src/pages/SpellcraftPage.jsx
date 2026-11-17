import { cloneElement } from "react"
import { Flex } from "../components/Flex"
import { Paper } from "../components/Paper"
import { SkillSummary } from "../components/SkillSummary"

import { SPELLCRAFT_CONFIG } from "../data/SpellcraftConfig"
import { SKILL_ICONS } from "../data/iconLibrary"
import { getSkillProgress } from "../game/gameEngine"
import { useGame } from "../hooks/useGame"
import { humanize } from "../utility/helpers"

export function SpellcraftPage() {
    const { player } = useGame()
    const skillId = SPELLCRAFT_CONFIG.id
    const skillProgress = getSkillProgress(player, SPELLCRAFT_CONFIG.id)
    const pageVariant = "spellcraft"

    return (
        <Flex direction="column" padding={32}>
            <Paper layer={0}>
                <SkillSummary
                    title={humanize(SPELLCRAFT_CONFIG.id)}
                    skillProgress={skillProgress}
                    variant={pageVariant}
                    icon={
                        <Icon
                            size={64} variant={pageVariant} outerRunes="solid" outerShape={3}
                            innerRunes="gap" innerShape={5} >
                            {cloneElement(SKILL_ICONS.RESEARCH, { size: 48 })}
                        </Icon>
                    }
                />
            </Paper>
        </Flex>
    )
}
