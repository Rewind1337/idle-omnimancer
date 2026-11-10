import './Paper.scss'

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function Paper({
  children,
  layer = 0,
  className = '',
  interactive = false,
  selected = false,
  ...props
}) {
  return (
    <div
      className={cx('paper', interactive && 'paper-interactive', selected && 'is-selected', className)}
      data-layer={layer}
      {...props}
    >
      {children}
    </div>
  )
}