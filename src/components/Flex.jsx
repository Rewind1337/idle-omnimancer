// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function Flex({
  children,
  className = '',
  direction = "row",
  align = 'center',
  justify = 'flex-start',
  wrap = false,
  gap = 8,
  padding = 0,
  ...props
}) {
  return (
    <div
      className={cx('flex', className)}
      style={{
        display: "flex",
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        flexWrap: (wrap ? "wrap" : "nowrap"),
        gap: gap,
        padding: padding}}
      {...props}
    >
      {children}
    </div>
  )
}