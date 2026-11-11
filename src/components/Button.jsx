import { Flex } from "./Flex"

import './Button.scss'

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'medium',
  icon,
  badge,
  disabled = false,
  toggled = false,
  onClick = () => {},
  type = 'button',
  ...props
}) {
  return (
    <button
      className={cx('button', toggled && 'button-toggled', className)}
      data-variant={variant}
      data-size={size}
      disabled={disabled}
      type={type}
      onClick={() => {onClick()}}
      {...props}
    >
      <Flex wrap={false} justify="space-between" gap={8} padding={0}>
        {icon && <span className="button-icon">{icon}</span>}
        {children ? <span className="button-content">{children}</span> : null}
        {badge && <span className="button-badge">{badge}</span>}
      </Flex>
    </button>
  )
}