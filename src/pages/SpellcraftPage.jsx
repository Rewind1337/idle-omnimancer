import { Flex } from "../components/Flex"
import { Paper } from "../components/Paper"
import { SkillSummary } from "../components/SkillSummary"

import { SPELLCRAFT_CONFIG } from "../data/SpellcraftConfig"
import { SKILL_ICONS } from "../data/iconLibrary"
import { getSkillProgress } from "../game/gameEngine"
import { useGame } from "../hooks/useGame"

export function SpellcraftPage() {
    const { player } = useGame()
    const skillProgress = getSkillProgress(player, SPELLCRAFT_CONFIG.id)

    return (
        <Flex direction="column" padding={32}>
            <Paper layer={0}>
                <SkillSummary
                    title="Spellcraft"
                    skillProgress={skillProgress}
                    variant="spellcraft"
                    icon={SKILL_ICONS.SPELLCRAFT}
                />
            </Paper>
        </Flex>
    )
}
