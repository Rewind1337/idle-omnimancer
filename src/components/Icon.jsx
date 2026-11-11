import './Icon.scss'

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function Icon({
  children,
  className = '',
  ...props
}) {
  return (
    <div
      className={cx('icon', className)}
      {...props}
    >
      {children}
    </div>
  )
}