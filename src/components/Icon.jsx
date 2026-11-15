import './Icon.scss'

import { cx } from '../utility/helpers'

export function Icon({
  children,
  className = '',

  size = 32,
  variant = 'primary',
  outerShape = null,
  outerRunes = null,
  innerShape = null,
  innerRunes = null,
  style = {},
  ...props
}) {
  const hasShape = outerShape !== null || innerShape !== null
  const hasRunes = outerRunes !== null || innerRunes !== null

  // CSS variables
  const iconStyle = (hasShape || hasRunes) ? {
    '--icon-size': typeof size === 'number' ? `${size}px` : size,

    '--icon-accent': `var(--skill-${variant}, var(--button-${variant}))`,
    '--icon-accent-hover': `var(--skill-${variant}-hover, var(--button-${variant}-hover))`,
    '--icon-accent-active': `var(--skill-${variant}-active, var(--button-${variant}-active))`,
    '--icon-accent-toggled': `var(--skill-${variant}-toggled, var(--button-${variant}-toggled))`,
    '--icon-accent-dark': `var(--skill-${variant}-dark, var(--button-${variant}-dark))`,
    '--icon-accent-border': `var(--skill-${variant}-border, var(--button-${variant}-border))`,
    '--icon-accent-text-on-light': `var(--skill-${variant}-text-on-light, var(--button-${variant}-text-on-light))`,
    '--icon-accent-text-on-dark': `var(--skill-${variant}-text-on-dark, var(--button-${variant}-text-on-dark))`,

    ...style,
  } : style

  return (
    <div
      className={cx('icon', hasShape && 'icon-frame', className)}
      data-variant={hasShape ? variant : undefined}
      style={iconStyle}
      {...props}
    >
      {hasShape ? (
        <>
          <span className={cx("icon icon-outer-runes", outerRunes ? '' : "no-background")} data-outer-runes={outerRunes} />
          <span className={cx("icon icon-outer-shape", outerShape ? '' : "no-background")} data-outer-shape={outerShape} />
          <span className={cx("icon icon-inner-runes", innerRunes ? '' : "no-background")} data-inner-runes={innerRunes} />
          <span className={cx("icon icon-inner-shape", innerShape ? '' : "no-background")} data-inner-shape={innerShape} />
          <span className={cx("icon icon-content")}>
            {children}
          </span>
        </>
      ) : children}
    </div>
  )
}