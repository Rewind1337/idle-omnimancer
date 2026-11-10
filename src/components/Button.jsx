import { Flex } from "./Flex"

import './Button.scss'

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'medium',
  prefix,
  suffix,
  disabled = false,
  toggled = false,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      className={cx('button', toggled && 'button-toggled', className)}
      data-variant={variant}
      data-size={size}
      disabled={disabled}
      type={type}
      onClick={() => {onClick()}}
      {...props}
    >
      <Flex wrap={false} justify="space-between" gap={0} padding={0}>
        {prefix && <span className="button-prefix">{prefix}</span>}
        {children ? <span className="button-content">{children}</span> : null}
        {suffix && <span className="button-suffix">{suffix}</span>}
      </Flex>
    </button>
  )
}