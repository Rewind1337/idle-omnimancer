import { BookOpen } from "lucide-react";

import { Flex } from "../components/Flex"
import { Grid } from "../components/Grid"
import { Paper } from "../components/Paper"
import { Icon } from "../components/Icon";
import { Button } from "../components/Button";

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

const RESEARCH_CONFIG = {
  maxTier: 8,

  baseDuration: 4,
  durationPerTier: 1,

  baseXp: 2,
  xpPerTier: 1.4,
  xpPerLevel: 1.10,

  baseCompletions: 1,
  completionsPerTier: 1.5,

  baseUnlockCost: 25,
  unlockCostPerTier: 10,
}

const RESEARCH_ACTION_DATA = Array.from(
  { length: RESEARCH_CONFIG.maxTier },
  (_, i) => ({
    id: `research-${i + 1}`,
    tier: i + 1,
    name: `Research ${i + 1}`,

    baseDurationSeconds:
      RESEARCH_CONFIG.baseDuration + i * RESEARCH_CONFIG.durationPerTier,

    baseXpPerCompletion:
      RESEARCH_CONFIG.baseXp * RESEARCH_CONFIG.xpPerTier ** i,

    startingCompletionsRequired:
      Math.round(RESEARCH_CONFIG.baseCompletions * RESEARCH_CONFIG.completionsPerTier ** i),

    unlockCostGold:
      i === 0 ? 0 : RESEARCH_CONFIG.baseUnlockCost * RESEARCH_CONFIG.unlockCostPerTier ** (i - 1),
  })
)

function getResearchXpRequired(research, level) {
  if (level < 1 || level >= 100) {
    return null
  }

  const startingXp =
    research.baseXpPerCompletion *
    research.startingCompletionsRequired

  const levelMultiplier = Math.pow(
    RESEARCH_CONFIG.xpPerLevel,
    level - 1
  )

  return Math.ceil(startingXp * levelMultiplier)
}

function ResearchAction({
  className = '',
  tier,
  name,
  baseDurationSeconds,
  baseXpPerCompletion,
}) {
  return (
    <Paper layer={1} className={cx('action action-research', className)}>
      <Flex direction="row" wrap={false}>
        <Icon><BookOpen/></Icon>
        <Flex direction="column">
          <Flex>
            <h2>{name}</h2>
            <h4 className="align-left align-start">Lv. 1 / 100</h4>
            <h3 className="align-right align-start">Tier {tier} Research</h3>
          </Flex>
          <Flex>
            <Paper layer={2}>Fancy Progress Bar or something</Paper>
            <Button variant={"research"}>Research</Button>
          </Flex>
          <Flex>
            <span>{baseDurationSeconds.toFixed(1)} Seconds</span>
            <span className="align-center">{baseXpPerCompletion.toFixed(1)} XP / Completition</span>
            <span className="align-right">{getResearchXpRequired(RESEARCH_ACTION_DATA[tier - 1], 1).toFixed(1)} XP Needed</span>
          </Flex>
          <Flex>
            <Paper layer={2}>Requires:</Paper>
            <Paper layer={2}>Gains:</Paper>
          </Flex>
        </Flex>
      </Flex>
    </Paper>
  )
}

export function ResearchPage() {
  return (
    <Flex direction="column">
        <Paper layer={0} variant={"research"}>
          <h1>Research</h1>
          <Grid>
            {RESEARCH_ACTION_DATA.map(action =>
              <ResearchAction key={action.id} {...action}></ResearchAction>
            )}
          </Grid>
        </Paper>
    </Flex>
  )
}