import { Paper } from "./Paper"
import { Flex } from "./Flex"

import './Inputs.scss'

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function InputCheckbox({
  className = '',
  label,
  checkboxLabel,
  layer = 0,
  variant = "primary",
  disabled = false,
  checked,
  onChange,
  ...props
}) {
  return (
    <Flex direction="column" padding={0} gap={8}>
      <Paper layer={layer} variant={variant} interactive={true} padding={4} className="clip-overflow">
        {label && <label data-layer={layer} data-variant={variant} className={cx('label input-label', className)}>{label}</label>}
        <Paper layer={layer+1} variant={variant} padding={"3px 2px 0 2px"} className="input-paper-wrapper">
          <Flex padding={0}>
            <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} data-variant={variant} className={cx('input input-checkbox', className)}
            {...props}/>
            {checkboxLabel && <label data-layer={layer+1} className={cx("label-checkbox-text", disabled ? "label-checkbox-text-disabled" : "")}>{checkboxLabel}</label>}
          </Flex>
        </Paper>
      </Paper>
    </Flex>
  )
}