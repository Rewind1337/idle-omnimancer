
import { Paper } from "./Paper"
import { Flex } from "./Flex"

import './Inputs.scss'

// Utility function that joins CSS classes after filtering for truthiness.
const cx = (...values) => values.filter(Boolean).join(' ')

export function InputSelect({
  className = '',
  label,
  layer = 0,
  variant = "primary",
  values = [],
  value = '',
  onChange,
  placeholder = "Select an option",
  id,
  ...props
}) {
  const handleChange = (event) => {
    const selectedOption = values.find(option => {
      const optionValue = typeof option === 'object'
        ? option.value
        : option

      return String(optionValue) === event.target.value
    })

    const selectedValue = selectedOption === undefined
      ? event.target.value
      : typeof selectedOption === 'object'
        ? selectedOption.value
        : selectedOption

    onChange?.(selectedValue)
  }

  return (
    <Flex direction="column" padding={0}>
      <Paper
        layer={layer}
        interactive={true}
        variant={variant}
        padding={4}
        className="clip-overflow"
      >
        {label && (
          <label
            htmlFor={id}
            data-layer={layer}
            data-variant={variant}
            className={cx('label input-label', className)}
          >
            {label}
          </label>
        )}

        <Paper
          layer={layer + 1}
          variant={variant}
          padding={"3px 2px 0 2px"}
          className="input-paper-wrapper"
        >
          <select
            id={id}
            value={value}
            onChange={handleChange}
            data-variant={variant}
            className={cx('input input-select', className)}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {values.map(option => {
              const optionValue = typeof option === 'object'
                ? option.value
                : option

              const optionLabel = typeof option === 'object'
                ? option.label ?? option.value
                : option

              return (
                <option
                  key={optionValue}
                  value={optionValue}
                  disabled={option.disabled}
                >
                  {optionLabel}
                </option>
              )
            })}
          </select>
        </Paper>
      </Paper>
    </Flex>
  )
}
