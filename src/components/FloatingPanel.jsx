import { Flex } from "./Flex"
import { cx } from '../utility/helpers'
import { Paper } from "./Paper"

export function FloatingPanel({
  children,
  direction = "row",
  className = '',
  margin = 8,
  position = "left",
  mode = "detailed",
}) {
  const isRight = position === "right"

  return (
    <Paper layer={0} className={cx("floating-panel", "w-min", `floating-panel-${mode}`, className)} style={{
      zIndex: 99,
      position: "fixed",
      left: isRight ? "auto" : margin,
      right: isRight ? margin : "auto",
      bottom: margin,
    }}>
      <Flex direction={direction}>
        {children}
      </Flex>
    </Paper>
  )
}
