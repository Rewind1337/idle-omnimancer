import { BookOpenText, Scale, WandSparkles } from "lucide-react";
import { Paper } from "./Paper";
import { Flex } from "./Flex";
import { Button } from "./Button";

import './Navigation.scss'

// utility function that joins the css classes after filtering for truthyness
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
    {id: 0, name: "Research", icon: <BookOpenText/>, level: 1},
    {id: 1, name: "Spellcraft", icon: <WandSparkles/>, level: 1},
    {id: 2, name: "Transmutation", icon: <Scale/>, level: 1},
  ];

  const NAVIGATION_BUTTONS = NAVIGATION_BUTTON_DATA.map((data =>
    <Button prefix={data.icon} suffix={data.level} onClick={() => {handleNavigationClick(data.id)}}>{data.name}</Button>
  ))

  if (position === "top") {
    return (
      <Paper
        className={cx('navigation navigation-top', className)}
        {...props}
      >
        <Flex wrap={false}>
          {NAVIGATION_BUTTONS}
        </Flex>
      </Paper>
    )
  } else if (position === "side") {
    return (
      <div
        className={cx('navigation navigation-side', className)}
        {...props}
      >
        <Flex direction="column" wrap={false}>
          {NAVIGATION_BUTTONS}
        </Flex>
      </div>
    )
  } else if (position === "mobile") {
    return (
      <div
        className={cx('navigation navigation-mobile', className)}
        {...props}
      >
        <Flex>
          {NAVIGATION_BUTTONS}
        </Flex>
      </div>
    )
  }
}