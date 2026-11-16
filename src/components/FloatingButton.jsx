import { Flex } from "./Flex"

import './Button.scss'
import { Badge } from "./Badge"

import { cx } from '../utility/helpers'

export function FloatingButton({
  children,
  className = '',
  anchors = ["bottom", "right"],
  margin = 8,
  transparent = false,
  variant = 'primary',
  size = 'medium',
  icon,
  badge,
  disabled = false,
  toggled = false,
  checked = false,
  onClick = () => { },
  type = 'button',
  ...props
}) {

  return (
    <button
      className={cx('button floating-button', transparent && 'button-transparent', toggled && 'button-toggled', className)}
      data-variant={variant}
      data-size={size}
      data-checked={checked}
      disabled={disabled}
      type={type}
      onClick={() => { onClick() }}
      style={{
        position: "absolute",
        left: anchors.includes("left") ? margin : "unset",
        right: anchors.includes("right") ? margin : "unset",
        top: anchors.includes("top") ? margin : "unset",
        bottom: anchors.includes("bottom") ? margin : "unset"
      }}
      {...props}
    >
      <Flex wrap={false} justify="space-between" gap={8} padding={0}>
        {icon && <span className="button-icon">{icon}</span>}
        {children ? <span className="button-content">{children}</span> : null}
        {badge && <Badge variant={variant} className="button-badge">{badge}</Badge>}
      </Flex>
    </button>
  )
}