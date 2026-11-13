
import { Paper } from "./Paper"
import { Flex } from "./Flex"

import './Inputs.scss'

// Utility function that joins CSS classes after filtering for truthiness.
const cx = (...values) => values.filter(Boolean).join(' ')

export function InputRadio({
  className = '',
  label,
  layer = 0,
  values = ["Option 1", "Option 2", "Option 3"],
  variant = "primary",
  name,
  value,
  onChange,
  direction = "row",
  ...props
}) {
  return (
    <Flex direction="column" padding={0}>
      <Paper layer={layer} variant={variant} interactive={true} padding={4} className="clip-overflow">
        {label && (<label data-layer={layer} data-variant={variant} className={cx('label input-label', className)}>{label}</label>)}

        <Paper layer={layer+1} variant={variant} padding={"3px 2px 0 2px"} className="input-paper-wrapper">
          <Flex direction={direction} padding={0}>
            {values.map((option, index) => {
              const optionValue = typeof option === 'object'
                  ? option.value
                  : option

              const optionLabel = typeof option === 'object'
                  ? option.label
                  : option

              return (<Flex key={name + "-" + index + "-radio"}>
                  <input
                    type="radio"
                    name={name}
                    value={optionValue}
                    checked={value === optionValue}
                    onChange={() => onChange?.(optionValue)}
                    data-variant={variant}
                    className={cx('input input-radio', className)}
                    {...props}
                  />

                  <label data-layer={layer+1} data-variant={variant} className="label-checkbox-text">
                      {optionLabel}
                  </label>
              </Flex>)
            })}
          </Flex>
        </Paper>
      </Paper>
    </Flex>
  )
}
