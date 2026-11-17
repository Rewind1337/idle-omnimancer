import './Paper.scss'

import { cx } from '../utility/helpers'

export function Paper({
  children,
  layer = 0,
  className = '',
  transparent = false,
  round = false,
  variant = null,
  hoverable = false,
  interactive = false,
  selected = false,
  style = {},
  padding = 8,
  ...props
}) {
  return (
    <div
      className={cx(
        'paper',
        transparent && 'paper-transparent',
        interactive && 'paper-interactive',
        hoverable && 'paper-hoverable',
        selected && 'is-selected',
        round && 'paper-round',
        className)}
      style={{ padding: padding, ...style }}
      data-variant={variant}
      data-layer={layer}
      {...props}
    >
      {children}
    </div>
  )
}