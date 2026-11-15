import { BookOpenText, Scale, WandSparkles, Star } from "lucide-react"

import { Paper } from "./Paper"
import { Tabs } from "./Tabs"

import './Navigation.scss'

// Utility function that joins CSS classes after filtering for truthiness.
const cx = (...values) => values.filter(Boolean).join(' ')

// Navigation tab definitions.
const NAVIGATION_TABS = [
  {
    id: 0,
    name: "Research",
    icon: <BookOpenText />,
    variant: "research",
    level: 1
  },
  {
    id: 1,
    name: "Spellcraft",
    icon: <WandSparkles />,
    variant: "spellcraft",
    level: 1
  },
  {
    id: 2,
    name: "Transmutation",
    icon: <Scale />,
    variant: "transmutation"
  },
  {
    id: 3,
    name: "Development",
    icon: <Star />,
    variant: "combat"
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