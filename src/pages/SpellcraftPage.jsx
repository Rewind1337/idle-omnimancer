import { Flex } from "../components/Flex"
import { Paper } from "../components/Paper"
import { RESEARCH_CONFIG } from "../data/researchConfig"
import { getSkillProgress } from "../game/gameEngine"
import { useGame } from "../hooks/useGame"

function SkillSummary({ skillProgress, variant }) {
  const totalPercentage = skillProgress.maxXP > 0 ? (skillProgress.totalXP / skillProgress.maxXP) * 100 : 0
  const levelPercentage = skillProgress.neededXP > 0 ? (skillProgress.xp / skillProgress.neededXP) * 100 : 100
  return (
    <Paper className="skill-summary" layer={1} variant={variant} padding={16}>
      <Flex direction="row" gap={32}>
        <Paper round layer="0" interactive className="w-min" padding={16}>
          <Icon size={64} variant={variant} outerRunes={"solid"} outerShape={3}
            innerRunes={"gap"} innerShape={3}>
            <BookOpen size={48} />
          </Icon>
        </Paper>
        <Flex direction="column">
          <Flex>
            <h1>Spellcraft</h1>
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

export function SpellcraftPage() {
  const { player, startAction, stopAction, unlockAction } = useGame()
  const skillId = RESEARCH_CONFIG.id
  const pageVariant = "research"
  const skillProgress = getSkillProgress(player, skillId)
  return (
    <Flex direction="column" padding={32}>
      <Paper layer={0}><SkillSummary skillProgress={skillProgress} variant={pageVariant} /></Paper>
    </Flex>
  )
}