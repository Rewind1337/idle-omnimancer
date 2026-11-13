import './Paper.scss'

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function Paper({
  children,
  layer = 0,
  className = '',
  transparent = false,
  variant = null,
  interactive = false,
  selected = false,
  style = {},
  padding = 8,
  ...props
}) {
  return (
    <div
      className={cx('paper', transparent && 'paper-transparent', interactive && 'paper-interactive', selected && 'is-selected', className)}
      style={{padding: padding,...style}}
      data-variant={variant}
      data-layer={layer}
      {...props}
    >
      {children}
    </div>
  )
}