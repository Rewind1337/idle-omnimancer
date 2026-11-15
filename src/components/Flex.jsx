import { cx } from '../utility/helpers'

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
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        flexWrap: (wrap ? "wrap" : "nowrap"),
        gap: gap,
        padding: padding
      }}
      {...props}
    >
      {children}
    </div>
  )
}