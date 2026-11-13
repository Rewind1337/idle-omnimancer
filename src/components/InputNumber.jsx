import { Paper } from "./Paper"
import { Flex } from "./Flex"

import './Inputs.scss'

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function InputNumber({
  className = '',
  label,
  layer = 0,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  variant = "primary",
  placeholder = "123",
  value,
  onChange,
  ...props
}) {
  const hasMinimum = (min > 0)
  const hasMaximum = (max !== Number.MAX_SAFE_INTEGER)

  return (
    <Flex direction="column" padding={0}>
      <Paper layer={layer} variant={variant} interactive={true} padding={4} className="clip-overflow">
        {label && <label data-layer={layer} data-variant={variant} className={cx('label input-label', className)}>{label}</label>}
          <Flex>
            {hasMinimum && <label data-layer={layer} data-variant={variant} className="label-number-min w-min">min. {min}</label>}
            <Paper layer={layer+1} variant={variant} padding={"3px 2px 0 2px"} className="input-paper-wrapper">
              <input type="number" value={value} min={(hasMinimum ? min : 0)} max={(hasMaximum ? max : 1e300)} onChange={onChange} data-variant={variant} placeholder={placeholder} className={cx('input input-number', className)}
              {...props}/>
            </Paper>
            {hasMaximum && <label data-layer={layer} data-variant={variant} className="label-number-max w-min">max. {max}</label>}
          </Flex>
        </Paper>
    </Flex>
  )
}