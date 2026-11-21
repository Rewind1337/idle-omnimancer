import { Paper } from "./Paper"
import { Tabs } from "./Tabs"

import { SKILL_NAVIGATION, DEVELOPMENT_NAVIGATION } from "../data/navigationData"
import { getSkillProgress } from "../game/gameEngine"
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
      .map(skill => {
        const isUnlocked = unlockedSkills.has(skill.skillId)
        const skillProgress = isUnlocked ? getSkillProgress(player, skill.skillId) : null

        return {
          ...skill,
          disabled: !isUnlocked,
          badge: skillProgress ? "Lv. " + skillProgress.level : null,
          badgeIcon: null,
        }
      }),
    DEVELOPMENT_NAVIGATION,
  ]

  const columns = position === "top" && mode !== "compact"
    ? {
      xsmall: 3,
      small: 4,
      medium: 5,
      large: 6
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
