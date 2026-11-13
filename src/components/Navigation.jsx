import { BookOpenText, Scale, WandSparkles, Star } from "lucide-react"
import { Paper } from "./Paper"
import { Flex } from "./Flex"
import { Grid } from "./Grid"
import { Button } from "./Button"

import './Navigation.scss'

// Utility function that joins CSS classes after filtering for truthiness.
const cx = (...values) => values.filter(Boolean).join(' ')

export function Navigation({
  className = '',
  position = "top",
  mode = "default",
  setActivePage,
  ...props
}) {
  const handleNavigationClick = (destinationPage) => {
    setActivePage(destinationPage)
  }

  const NAVIGATION_BUTTON_DATA = [
    { id: 0, name: "Research", icon: <BookOpenText />, level: 1 },
    { id: 1, name: "Spellcraft", icon: <WandSparkles />, level: 1},
    { id: 2, name: "Transmutation", icon: <Scale />, level: 0},
    { id: 3, name: "Development", icon: <Star />, variant: "combat"},
  ]

  const NAVIGATION_BUTTONS = NAVIGATION_BUTTON_DATA.map(data => (
    <Button
      key={`nav-${data.id}`}
      size="large"
      variant={data.variant ? data.variant : data.name.toLowerCase()}
      icon={data.icon}
      badge={data.level ? data.level : null}
      disabled={data.disabled ?? false}
      onClick={() => handleNavigationClick(data.id)}
    >
      {data.name}
    </Button>
  ))

  if (position === "top") {
    return (
      <Paper
        padding={0}
        variant={"transparent"}
        className={cx('navigation navigation-top', 'navigation-' + mode, className)}
        {...props}
      >
        {mode === "compact" ?
          <Flex wrap={mode === "compact"}>
            {NAVIGATION_BUTTONS}
          </Flex>
        :
          <Grid columns={mode === "compact" ? { xsmall: 4, small: 5, medium: 6, large: 8 } : { xsmall: 2, small: 3, medium: 4, large: 5 }}>
            {NAVIGATION_BUTTONS}
          </Grid>
        }
      </Paper>
    )
  }

  if (position === "side") {
    return (
      <Paper
        padding={0}
        variant={"transparent"}
        className={cx('navigation navigation-side', 'navigation-' + mode, className)}
        {...props}
      >
        <Flex direction="column" wrap={false}>
          {NAVIGATION_BUTTONS}
        </Flex>
      </Paper>
    )
  }

  return null
}