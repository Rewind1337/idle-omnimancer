import { Flex } from './Flex'

import './Badge.scss'

import { cx } from '../utility/helpers'
import { Heading } from './Heading'
import { Tooltip } from './Tooltip'

export function Badge({
  children,
  className = '',
  variant = 'primary',
  size = 'medium',
  interactive = false,
  icon,
  iconPosition = "left",
  tooltip = null,
  onClick = () => { },
  ...props
}) {

  const finalBadge = (<div
    className={cx('badge', interactive && 'badge-interactive', className)}
    data-variant={variant}
    data-size={size}
    onClick={() => { onClick() }}
    {...props}
  >
    <Flex wrap={false} justify="space-between" gap={8} padding={0}>
      {(icon && iconPosition === "left") && <span className="badge-icon">{icon}</span>}
      {children ? <Heading h='4' className="badge-content">{children}</Heading> : null}
      {(icon && iconPosition === "right") && <span className="badge-icon">{icon}</span>}
    </Flex>
  </div>)

  if (tooltip) {
    return (
      <Tooltip content={tooltip} variant={variant}>
        {finalBadge}
      </Tooltip>
    )
  } else {
    return finalBadge
  }
}