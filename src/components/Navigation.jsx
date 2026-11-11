import { BookOpenText, Scale, WandSparkles, Star } from "lucide-react"
import { Paper } from "./Paper"
import { Flex } from "./Flex"
import { Grid } from "./Grid"
import { Button } from "./Button"

import './Navigation.scss'
import { Badge } from "./Badge"

// Utility function that joins CSS classes after filtering for truthiness.
const cx = (...values) => values.filter(Boolean).join(' ')

export function Navigation({
  className = '',
  position = "top",
  setActivePage,
  ...props
}) {
  const handleNavigationClick = (destinationPage) => {
    setActivePage(destinationPage)
  }

  const NAVIGATION_BUTTON_DATA = [
    { id: 0, name: "Research", icon: <BookOpenText />, level: 1 },
    { id: 1, name: "Spellcraft", icon: <WandSparkles />, level: 1},
    { id: 2, name: "Transmutation", icon: <Scale />, level: 1},
    { id: 3, name: "TBA", icon: <Star />, disabled: true },
  ]

  const NAVIGATION_BUTTONS = NAVIGATION_BUTTON_DATA.map(data => (
    <Button
      key={`nav-${data.id}`}
      variant={data.name.toLowerCase()}
      icon={data.icon}
      badge={<Badge variant={data.name.toLowerCase()}>{data.level}</Badge>}
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
        className={cx('navigation navigation-top', className)}
        {...props}
      >
        <Grid columns={{ small: 3, medium: 4, large: 5 }}>
          {NAVIGATION_BUTTONS}
        </Grid>
      </Paper>
    )
  }

  if (position === "side") {
    return (
      <Paper
        padding={0}
        variant={"transparent"}
        className={cx('navigation navigation-side', className)}
        {...props}
      >
        <Flex direction="column" wrap={false}>
          {NAVIGATION_BUTTONS}
        </Flex>
      </Paper>
    )
  }

  if (position === "mobile") {
    return (
      <Paper
        className={cx('navigation navigation-mobile', className)}
        {...props}
      >
        <Grid columns={{ small: 5, medium: 5, large: 5 }}>
          {NAVIGATION_BUTTONS}
        </Grid>
      </Paper>
    )
  }

  return null
}