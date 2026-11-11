import './Grid.scss'

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function Grid({
  children,
  className = '',
  gap = 8,
  padding = 0,
  columns = { xsmall: 1, small: 2, medium: 3, large: 4 },
  ...props
}) {
  return (
    <div
      className={cx('grid', className)}
      data-columns-xsmall={columns.xsmall ?? 1}
      data-columns-small={columns.small ?? columns.xsmall ?? 1}
      data-columns-medium={columns.medium ?? columns.small ?? columns.xsmall ?? 1}
      data-columns-large={columns.large ?? columns.medium ?? columns.small ?? columns.xsmall ?? 1}
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