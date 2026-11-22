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
  interactive = true,
  style = {},
  ...props
}) {
  const hasShape = outerShape !== null || innerShape !== null
  const hasRunes = outerRunes !== null || innerRunes !== null
  const isFancyIcon = (hasShape || hasRunes)

  // CSS variables
  const iconStyle = {
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
  }

  return (
    <div
      className={cx('icon', isFancyIcon && 'icon-frame', !interactive && 'no-hover', className)}
      data-variant={variant}
      style={iconStyle}
      {...props}
    >
      {isFancyIcon ? (
        <>
          {outerRunes &&
            <svg className={cx("icon icon-outer-runes", outerRunes ? '' : "no-background")} data-outer-runes={outerRunes} viewBox="0 0 100 100" width="100" height="100" version="1.1" xmlns="http://www.w3.org/2000/svg">
              {outerRunes === "solid" && <circle cx="50" cy="50" r="50" style={{ strokeWidth: "5px", stroke: "var(--icon-accent-border)", background: "transparent" }} />}
              {outerRunes === "dashed" && <circle strokeDasharray="6, 6" cx="50" cy="50" r="50" style={{ strokeWidth: "5px", stroke: "var(--icon-accent-border)", background: "transparent" }} />}
              {outerRunes === "dotted" && <circle strokeDasharray="2, 4" cx="50" cy="50" r="50" style={{ strokeWidth: "5px", stroke: "var(--icon-accent-border)", background: "transparent" }} />}
              {outerRunes === "gap" && <circle strokeDasharray="6, 18" cx="50" cy="50" r="50" style={{ strokeWidth: "5px", stroke: "var(--icon-accent-border)", background: "transparent" }} />}
              {outerRunes === "wide" && <circle strokeDasharray="15, 16" cx="50" cy="50" r="50" style={{ strokeWidth: "5px", stroke: "var(--icon-accent-border)", background: "transparent" }} />}
            </svg>
          }


          <span className={cx("icon icon-outer-shape", outerShape ? '' : "no-background")} data-outer-shape={outerShape} />

          {innerRunes &&
            <svg className={cx("icon icon-inner-runes", innerRunes ? '' : "no-background")} data-inner-runes={innerRunes} viewBox="0 0 100 100" width="100" height="100" version="1.1" xmlns="http://www.w3.org/2000/svg">
              {innerRunes === "solid" && <circle cx="50" cy="50" r="50" style={{ strokeWidth: "2px", stroke: "var(--icon-accent-border)", background: "transparent" }} />}
              {innerRunes === "dashed" && <circle strokeDasharray="6, 6" cx="50" cy="50" r="50" style={{ strokeWidth: "2px", stroke: "var(--icon-accent-border)", background: "transparent" }} />}
              {innerRunes === "dotted" && <circle strokeDasharray="2, 4" cx="50" cy="50" r="50" style={{ strokeWidth: "2px", stroke: "var(--icon-accent-border)", background: "transparent" }} />}
              {innerRunes === "gap" && <circle strokeDasharray="5, 15" cx="50" cy="50" r="50" style={{ strokeWidth: "2px", stroke: "var(--icon-accent-border)", background: "transparent" }} />}
              {innerRunes === "wide" && <circle strokeDasharray="15, 15" cx="50" cy="50" r="50" style={{ strokeWidth: "2px", stroke: "var(--icon-accent-border)", background: "transparent" }} />}
            </svg>
          }

          <span className={cx("icon icon-inner-shape", innerShape ? '' : "no-background")} data-inner-shape={innerShape} />

          <span className={cx("icon icon-content")}>
            {children}
          </span>
        </>
      ) : <div style={iconStyle}>{children}</div>}
    </div>
  )
}