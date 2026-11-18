import { Paper } from "./Paper"

import './Progress.scss'

import { cx } from '../utility/helpers'

export function Progress({
  className = '',
  layer = 0,
  percentage,
  label,
  size = "medium",
  corners = "sharp",
  animated = false,
  variant = "primary",
}) {
  return (
    <Paper layer={layer} variant={variant} data-size={size} data-corners={corners} padding={0} className={cx('progress-wrapper', className)}>
      <Paper data-variant={variant} data-animated={animated ? 'true' : 'false'} padding={0} className={cx('progress-bar')} style={{ width: percentage + "%" }}>
        <h3 className="align-center">{label ?? (percentage.toFixed(1) + "%")}</h3>
      </Paper>
    </Paper>
  )
}