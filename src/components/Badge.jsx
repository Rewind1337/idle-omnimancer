import { Flex } from './Flex'

import './Badge.scss'

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function Badge({
  children,
  className = '',
  variant = 'primary',
  size = 'medium',
  interactive = false,
  icon,
  onClick = () => {},
  ...props
}) {
  return (
    <div
      className={cx('badge', interactive && 'badge-interactive', className)}
      data-variant={variant}
      data-size={size}
      onClick={() => {onClick()}}
      {...props}
    >
      <Flex wrap={false} justify="space-between" gap={8} padding={0}>
        {icon && <span className="badge-icon">{icon}</span>}
        {children ? <span className="badge-content">{children}</span> : null}
      </Flex>
    </div>
  )
}