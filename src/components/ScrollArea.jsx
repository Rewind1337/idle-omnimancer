import './ScrollArea.scss'

import { cx } from '../utility/helpers'

export function ScrollArea({
  children,
  className = '',
  scrollY = true,
  scrollX = false,
  padding = 8,
  maxHeight = "auto", // make this automatically fill the rest of the available page, maximum
  ...props
}) {
  return (
    <div
      className={cx('scroll-area', scrollX === true && 'scroll-x', scrollY === true && 'scroll-y', className)}
      style={{
        flex: 1,
        minHeight: 0,
        maxHeight: maxHeight,
        padding: padding,
        height: "auto"
      }}
      {...props}
    >
      {children}
    </div>
  )
}