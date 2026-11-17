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
    <Paper layer={0} className={cx("floating-panel", "w-min", className)} style={{
      zIndex: 987,
      position: "absolute",
      right: margin + 8,
      bottom: margin,
    }}>
      <Flex direction={direction}>
        {children}
      </Flex>
    </Paper>
  )
}