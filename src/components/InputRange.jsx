import { Paper } from "./Paper"
import { Flex } from "./Flex"

import './Inputs.scss'

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function InputRange({
  className = '',
  label,
  layer = 0,
  min = 0,
  max = 100,
  variant = "primary",
  value,
  onChange,
  ...props
}) {
  const percentage = ((value - min) / (max - min)) * 100
  const thumbOffset = 12
  const position = `calc(${percentage}% + ${thumbOffset - (percentage / 100) * thumbOffset * 2}px)`

  return (
    <Flex direction="column" padding={0}>
      <Paper layer={layer} interactive={true} variant={variant} padding={4} className="clip-overflow">
        {label && <label data-layer={layer} data-variant={variant} className={cx('label input-label', className)}>{label}</label>}
        <Flex>
          <label data-layer={layer} data-variant={variant} className="label-range-min w-min">min. {min}</label>
          <Paper className="input-range-wrapper input-paper-wrapper" layer={layer+1} variant={variant} padding={"3px 2px 0 2px"}>
            <input type="range" value={value} onChange={onChange} min={min} max={max} step={1} data-variant={variant} className={cx('input input-range', className)}
            {...props}/>
            <Paper className="input-range-tooltip" style={{ left: position }}>
              <h2>{value}</h2>
            </Paper>
          </Paper>
          <label data-layer={layer} data-variant={variant} className="label-range-max w-min">max. {max}</label>
        </Flex>
      </Paper>
    </Flex>
  )
}