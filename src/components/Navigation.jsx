import { Paper } from "./Paper"
import { Tabs } from "./Tabs"
import { OTHER_ICONS, SKILL_ICONS } from "../data/iconLibrary"

import './Navigation.scss'

import { cx } from '../utility/helpers'

// Navigation tab definitions.
const NAVIGATION_TABS = [
  {
    id: 0,
    name: "Research",
    icon: SKILL_ICONS.RESEARCH,
    variant: "research"
  },
  {
    id: 1,
    name: "Spellcraft",
    icon: SKILL_ICONS.SPELLCRAFT,
    variant: "spellcraft"
  },
  {
    id: 2,
    name: "Transmutation",
    icon: SKILL_ICONS.TRANSMUTATION,
    variant: "transmutation"
  },
  {
    id: 3,
    name: "Exploration",
    icon: SKILL_ICONS.EXPLORATION,
    variant: "exploration"
  },
  {
    id: 4,
    name: "Unveiling",
    icon: SKILL_ICONS.UNVEILING,
    variant: "unveiling"
  },
  {
    id: 5,
    name: "Combat",
    icon: SKILL_ICONS.COMBAT,
    variant: "combat"
  },
  {
    id: 6,
    name: "Companions",
    icon: SKILL_ICONS.COMPANIONS,
    variant: "companions"
  },
  {
    id: 7,
    name: "Development",
    icon: OTHER_ICONS.STAR,
    variant: "",
    transparent: true,
  }
]

export function Navigation({
  className = '',
  position = "top",
  mode = "default",
  activePage,
  setActivePage,
  ...props
}) {
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
        tabs={NAVIGATION_TABS}
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