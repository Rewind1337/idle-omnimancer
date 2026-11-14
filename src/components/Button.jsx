import { Flex } from "./Flex"

import './Button.scss'
import { Badge } from "./Badge"

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function Button({
  children,
  className = '',
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
      className={cx('button', transparent && 'button-transparent', toggled && 'button-toggled', className)}
      data-variant={variant}
      data-size={size}
      data-checked={checked}
      disabled={disabled}
      type={type}
      onClick={() => { onClick() }}
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