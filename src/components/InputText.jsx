import { Paper } from "./Paper"
import { Flex } from "./Flex"

import './Inputs.scss'

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function InputText({
  className = '',
  label,
  layer = 0,
  variant = "primary",
  placeholder = "Placeholder",
  value,
  onChange,
  ...props
}) {
  return (
    <Flex direction="column" padding={0}>
      <Paper layer={layer} interactive={true} variant={variant} padding={4} className="clip-overflow">
        {label && <label data-layer={layer} data-variant={variant} className={cx('label input-label', className)}>{label}</label>}
        <Paper layer={layer+1} variant={variant} padding={"3px 2px 0 2px"} className="input-paper-wrapper">
            <input type="text" onChange={onChange} value={value} data-variant={variant} placeholder={placeholder} className={cx('input input-text', className)}
            {...props}/>
        </Paper>
      </Paper>
    </Flex>
  )
}