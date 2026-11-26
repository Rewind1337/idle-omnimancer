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
  top = null,
}) {
  const isTop = position === "top-right"
  const isRight = position === "right" || isTop

  return (
    <Paper layer={0} className={cx("floating-panel", "w-min", `floating-panel-${mode}`, className)} style={{
      zIndex: 99,
      position: "fixed",
      left: isRight ? "auto" : margin,
      right: isRight ? margin : "auto",
      top: isTop ? (top ?? margin) : "auto",
      bottom: isTop ? "auto" : margin,
    }}>
      <Flex direction={direction}>
        {children}
      </Flex>
    </Paper>
  )
}
