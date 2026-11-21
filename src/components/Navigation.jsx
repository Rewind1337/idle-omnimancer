import { Paper } from "./Paper"
import { Flex } from "./Flex"
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
  sideActionsLeft = null,
  sideActionsRight = null,
  ...props
}) {
  const { player } = useGame()
  const unlockedSkills = new Set(player.unlockedSkills)
  const nextLockedSkill = SKILL_NAVIGATION.find(
    skill => !unlockedSkills.has(skill.skillId)
  )

  const tabs = [
    ...SKILL_NAVIGATION
      .filter(skill =>
        unlockedSkills.has(skill.skillId) ||
        skill === nextLockedSkill
      )
      .map(skill => {
        const isUnlocked = unlockedSkills.has(skill.skillId)
        const skillProgress = isUnlocked ? getSkillProgress(player, skill.skillId) : null

        return {
          ...skill,
          disabled: !isUnlocked,
          badge: skillProgress ? "Lv. " + skillProgress.level : null,
          badgeIcon: null,
          toggled: player.activeAction?.skillId === skill.skillId,
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
      padding={2}
      variant="transparent"
      className={cx(
        'navigation',
        `navigation-${position}`,
        `navigation-${mode}`,
        className
      )}
      {...props}
    >
      {position === "side" ? (
        <Flex direction="column" align="stretch" gap={16} className="navigation-side-layout">
          <Tabs
            tabs={tabs}
            value={activePage}
            onChange={setActivePage}
            size="large"
            direction="column"
            className="navigation-tabs"
          />
          {sideActionsLeft && (
            <div className="navigation-side-section navigation-side-section-left" role="group" aria-label="Shop, missions and bag">
              {sideActionsLeft}
            </div>
          )}
          {sideActionsRight && (
            <div className="navigation-side-section navigation-side-section-right" role="group" aria-label="Settings">
              {sideActionsRight}
            </div>
          )}
        </Flex>
      ) : (
        <Tabs
          tabs={tabs}
          value={activePage}
          onChange={setActivePage}
          size="large"
          direction="row"
          wrap={mode === "compact"}
          columns={columns}
          className="navigation-tabs"
        />
      )}
    </Paper>
  )
}
