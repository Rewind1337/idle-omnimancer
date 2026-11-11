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
    level: (i === 0 ? 1 : 0),

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

// Will move into own file later

function ActionHeader({
  className = '',
  tier,
  name,
  level,
}) {
  return (
    <Flex className={cx('action-header', className)}>
      <h2>{name}</h2>
      <h4 className="align-left">Lv. {level} / 100</h4>
      <h3 className="align-right">Tier {tier} Research</h3>
    </Flex>
  )
}

function ActionDetails({
  className = '',
  tier,
  baseDurationSeconds,
  baseXpPerCompletion
}) {
  return (
    <Flex className={cx('action-details', className)}>
      <span>{baseDurationSeconds.toFixed(1)} Seconds</span>
      <span className="align-center">{baseXpPerCompletion.toFixed(1)} XP / Completition</span>
      <span className="align-right">{getResearchXpRequired(RESEARCH_ACTION_DATA[tier - 1], 1).toFixed(1)} XP Needed</span>
    </Flex>
  )
}

function ActionProgress({
  className = '',
}) {
  return (
    <Flex className={cx('action-progress', className)}>
      <Paper layer={2}><h3 className="align-center">Fancy Progress Bar</h3></Paper>
      <Button variant={"research"}>Research</Button>
    </Flex>
  )
}

function ActionResources({
  className = '',
}) {
  return (
    <Flex className={cx('action-resources', className)}>
      <Paper layer={2}>Requires:</Paper>
      <Paper layer={2}>Gains:</Paper>
    </Flex>
  )
}

function ResearchAction({
  className = '',
  name,
  level,
  tier,
  baseDurationSeconds,
  baseXpPerCompletion,
}) {
  return (
    <Paper layer={1} className={cx('action action-research', className)}>
      <Flex direction="column">
        <Flex direction="row">
          <Icon><BookOpen/></Icon>
          <Flex direction="column">
            <ActionHeader name={name} level={level} tier={tier}/>
            <ActionProgress/>
          </Flex>
        </Flex>
        <ActionDetails tier={tier} baseDurationSeconds={baseDurationSeconds} baseXpPerCompletion={baseXpPerCompletion} />
        <ActionResources/>
      </Flex>
    </Paper>
  )
}

function SkillSummary({
  className = '',
  text
}) {
  return (
    <Paper className={cx('skill-summary', className)} layer={1} variant={"research"}>
      <Flex direction="column">
        <Flex>
          <h1>{text}</h1>
          <h3 className="align-right">Total Levels: 0 of 69420</h3>
        </Flex>
        <Flex className={cx('skill-progress', className)}>
          <Paper layer={2}><h3 className="align-center">Fancy Progress Bar</h3></Paper>
        </Flex>
      </Flex>
    </Paper>
  )
}

export function ResearchPage() {
  return (
    <Flex direction="column">
      <Paper layer={0} variant={"research"}>
        <Flex direction="column">
          <SkillSummary text={"Research"}/>
          <Grid>
            {RESEARCH_ACTION_DATA.filter(action => action.level !== 0).map(action =>
              <ResearchAction key={action.id} {...action}></ResearchAction>
            )}
          </Grid>
        </Flex>
      </Paper>
    </Flex>
  )
}