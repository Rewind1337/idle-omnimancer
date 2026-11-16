import { BookOpen } from "lucide-react";

import { Flex } from "../components/Flex"
import { Grid } from "../components/Grid"
import { Paper } from "../components/Paper"
import { Icon } from "../components/Icon";
import { Button } from "../components/Button";
import { Progress } from "../components/Progress";
import { Heading } from "../components/Heading";
import { humanize } from "../utility/helpers";

import { cx } from "../utility/helpers";
import { RESEARCH_CONFIG } from "../data/researchConfig";
import { useState } from "react";

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
  actionTime,
  actionXP,
  neededXP
}) {
  return (
    <Flex className={cx('action-details', className)}>
      <span>{actionTime.toFixed(1)} Seconds</span>
      <span className="align-center">{actionXP.toFixed(1)} XP / Completition</span>
      <span className="align-right">{neededXP.toFixed(1)} XP Needed</span>
    </Flex>
  )
}

function ActionProgress({
  className = '',
  percentage = 33,
  actionID,
  isActive,
  setActive,
}) {
  return (
    <Flex className={cx('action-progress', className)}>
      <Progress corners="rounded" size="medium" layer={2} variant="research"
        percentage={percentage} animated={isActive} />
      <Button variant={"research"} toggled={isActive} onClick={() => { setActive(actionID) }}>Research</Button>
    </Flex>
  )
}

function ActionResources({
  className = '',
  consumes,
  produces
}) {
  return (
    <Flex className={cx('action-resources', className)} align="start" justify="start">
      {consumes.length > 0 && <Paper layer={2}>
        <Flex direction="column" >
          <Heading h="2">Consumes:</Heading>
          <Flex wrap>
            {consumes.map((C) => <Paper className="w-min flex-grow" layer="3">1x {humanize(C)}</Paper>)}
          </Flex>
        </Flex>
      </Paper>}
      {produces.length > 0 && <Paper layer={2}>
        <Flex direction="column">
          <Heading h="2">Produces:</Heading>
          <Flex wrap>
            {produces.map((P) => <Paper className="w-min flex-grow" layer="3">1x {humanize(P)}</Paper>)}
          </Flex>
        </Flex>
      </Paper>}
    </Flex>
  )
}

function ResearchAction({
  className = '',
  actionID = 0,
  isActive,
  setActive = () => { },
  level,
}) {
  const SKILL = RESEARCH_CONFIG
  const ACTION = SKILL.actions[actionID]
  const consumes = ACTION.consumes || []
  const produces = ACTION.produces || []
  return (
    <Paper layer={1} variant={"research"} className={cx('action action-research', className)}>
      <Flex direction="column">
        <Flex direction="row">
          <Icon><BookOpen /></Icon>
          <Flex direction="column">
            <ActionHeader name={humanize(ACTION.id)} level={level} tier={ACTION.tier} />
            <ActionProgress isActive={isActive} setActive={setActive} actionID={actionID} />
          </Flex>
        </Flex>
        <ActionDetails tier={ACTION.tier} actionTime={SKILL.time.base} actionXP={SKILL.actionXP.base} neededXP={SKILL.neededXP.base} />
        <ActionResources consumes={consumes} produces={produces} />
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
  const [activeActionID, setActiveActionID] = useState(null)

  return (
    <Flex direction="column">
      <Paper layer={0}>
        <Flex direction="column">
          <SkillSummary text={"Research"} />
          <Grid columns={{ small: 1, medium: 2, large: 3 }}>
            <ResearchAction actionID={0} isActive={activeActionID === 0} setActive={setActiveActionID} level={1}></ResearchAction>
          </Grid>
        </Flex>
      </Paper>
    </Flex>
  )
}