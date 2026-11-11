import './Paper.scss'

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function Paper({
  children,
  layer = 0,
  className = '',
  variant = null,
  interactive = false,
  selected = false,
  padding = 8,
  ...props
}) {
  return (
    <div
      className={cx('paper', interactive && 'paper-interactive', selected && 'is-selected', className)}
      style={{padding: padding}}
      data-variant={variant}
      data-layer={layer}
      {...props}
    >
      {children}
    </div>
  )
}