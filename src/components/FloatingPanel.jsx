import { Flex } from "./Flex"

import { cx } from '../utility/helpers'
import { Paper } from "./Paper"

export function FloatingPanel({
  children,
  direction = "row",
  className = '',
  margin = 8,
}) {

  return (
    <Paper transparent className={cx("floating-panel", "w-min", className)} style={{
      position: "absolute",
      right: margin,
      bottom: margin,
    }}>
      <Flex direction={direction}>
        {children}
      </Flex>
    </Paper>
  )
}