import { Paper } from "./Paper"

import './Progress.scss'

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function Progress({
  className = '',
  layer = 0,
  percentage,
  size = "medium",
  corners = "sharp",
  animated = String(false),
  variant = "primary",
}) {
  return (
    <Paper layer={layer} variant={variant} data-size={size} data-corners={corners} padding={0} className={cx('progress-wrapper', className)}>
        <Paper data-variant={variant} data-animated={animated} padding={0} className={cx('progress-bar')} style={{width: percentage + "%"}}>
            <h3 className="align-center">{percentage}%</h3>
        </Paper>
    </Paper>
  )
}