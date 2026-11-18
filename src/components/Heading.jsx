import './Button.scss'

import { cx } from '../utility/helpers'

export function Heading({
    children,
    className = '',
    text,
    variant = '',
    h = '1',
    weight = 500,
    ...props
}) {
    const Tag = `h${h}`
    return (
        <Tag data-variant={variant} className={cx('heading heading-h' + h, className)} {...props}
            style={{ fontWeight: weight }}>
            {text} {children}
        </Tag>
    )
}