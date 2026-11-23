import { Paper } from "./Paper"
import { Flex } from "./Flex"
import { Tabs } from "./Tabs"

import { SKILL_NAVIGATION } from "../data/navigationData"
import { getSkillProgress } from "../game/gameEngine"
import { useGame } from "../hooks/useGame"

import './Navigation.scss'

import { cx } from '../utility/helpers'

export function Navigation({
  className = '',
  position = "top",
  mode = "detailed",
  activePage,
  setActivePage,
  sideActionsLeft = null,
  sideActionsRight = null,
  ...props
}) {
  const { player } = useGame()
  const unlockedSkills = new Set(player.unlockedSkills)
  const topSkills = SKILL_NAVIGATION.filter(skill => !skill.floatingPanel)
  const nextLockedSkill = topSkills.find(
    skill => !unlockedSkills.has(skill.skillId)
  )

  const tabs = [
    ...topSkills
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
          toggled: player.activeAction?.skillId === skill.skillId ||
            (skill.skillId === "skill:combat" &&
              Object.values(player.skills?.[skill.skillId]?.actions ?? {}).some(action => action.running)),
        }
      }),
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
            <div className="navigation-side-section navigation-side-section-left" role="group" aria-label="Companions, shop, missions and bag">
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
