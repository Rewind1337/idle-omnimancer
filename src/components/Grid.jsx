import './Grid.scss'

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function Grid({
  children,
  className = '',
  gap = 8,
  padding = 0,
  columns = { small: 1, medium: 2, large: 3 },
  ...props
}) {
  return (
    <div
      className={cx('grid', className)}
      data-columns-small={columns.small ?? 1}
      data-columns-medium={columns.medium ?? columns.small ?? 1}
      data-columns-large={columns.large ?? columns.medium ?? columns.small ?? 1}
      style={{
        display: 'grid',
        gap: gap,
        padding: padding,
      }}
      {...props}
    >
      {children}
    </div>
  )
}