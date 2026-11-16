import { Paper } from "./Paper"
import { Tabs } from "./Tabs"

import { SKILL_NAVIGATION, DEVELOPMENT_NAVIGATION } from "../data/skillNavigation"
import { useGame } from "../hooks/useGame"

import './Navigation.scss'

import { cx } from '../utility/helpers'

export function Navigation({
  className = '',
  position = "top",
  mode = "default",
  activePage,
  setActivePage,
  ...props
}) {
  const { player } = useGame()
  const unlockedSkills = new Set(player.unlockedSkills)
  const nextLockedSkill = SKILL_NAVIGATION.find(
    skill => !unlockedSkills.has(skill.skillId)
  )

  const tabs = [
    ...SKILL_NAVIGATION
      .filter(skill => unlockedSkills.has(skill.skillId) || skill === nextLockedSkill)
      .map(skill => ({
        ...skill,
        disabled: !unlockedSkills.has(skill.skillId),
      })),
    DEVELOPMENT_NAVIGATION,
  ]

  const columns = position === "top" && mode !== "compact"
    ? {
      xsmall: 2,
      small: 3,
      medium: 4,
      large: 5
    }
    : null

  return (
    <Paper
      padding={0}
      variant="transparent"
      className={cx(
        'navigation',
        `navigation-${position}`,
        `navigation-${mode}`,
        className
      )}
      {...props}
    >
      <Tabs
        tabs={tabs}
        value={activePage}
        onChange={setActivePage}
        size="large"
        direction={position === "side" ? "column" : "row"}
        wrap={position === "top" && mode === "compact"}
        columns={columns}
        className="navigation-tabs"
      />
    </Paper>
  )
}
