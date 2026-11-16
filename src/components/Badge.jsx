import { Flex } from './Flex'

import './Badge.scss'

import { cx } from '../utility/helpers'

export function Badge({
  children,
  className = '',
  variant = 'primary',
  size = 'medium',
  interactive = false,
  icon,
  iconPosition = "left",
  onClick = () => { },
  ...props
}) {
  return (
    <div
      className={cx('badge', interactive && 'badge-interactive', className)}
      data-variant={variant}
      data-size={size}
      onClick={() => { onClick() }}
      {...props}
    >
      <Flex wrap={false} justify="space-between" gap={8} padding={0}>
        {(icon && iconPosition === "left") && <span className="badge-icon">{icon}</span>}
        {children ? <span className="badge-content">{children}</span> : null}
        {(icon && iconPosition === "right") && <span className="badge-icon">{icon}</span>}
      </Flex>
    </div>
  )
}