
import { Paper } from "./Paper"
import { Flex } from "./Flex"
import { Button } from "./Button"

import './Inputs.scss'

// Utility function that joins CSS classes after filtering for truthiness.
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
  renderButtons = false,
  ...props
}) {
  const handleChange = (event) => {
    onChange?.(renderButtons ? !checked : event.target.checked)
  }

  return (
    <Flex direction="column" padding={0} gap={8}>
      <Paper layer={layer} variant={variant} interactive={true} padding={4} className="clip-overflow">
        {label && (
          <label data-layer={layer} data-variant={variant} className={cx('label input-label')}>
            {label}
          </label>
        )}

        <Paper layer={layer + 1} variant={variant} padding={"3px 2px 0 2px"} className="input-paper-wrapper">
          {renderButtons ? (
            <Flex padding={0}>
              <Button transparent={!checked} variant={variant} checked={checked} disabled={disabled} onClick={handleChange} className={cx('input input-button', className)} {...props}>
                {checkboxLabel}
              </Button>
            </Flex>
          ) : (
            <Flex padding={0}>
              <input type="checkbox" checked={checked} onChange={handleChange} disabled={disabled} data-variant={variant} className={cx('input input-checkbox', className)} {...props} />
              {checkboxLabel && (
                <label data-layer={layer + 1} className={cx("label-checkbox-text", disabled && "label-checkbox-text-disabled")}>
                  {checkboxLabel}
                </label>
              )}
            </Flex>
          )}
        </Paper>
      </Paper>
    </Flex>
  )
}
