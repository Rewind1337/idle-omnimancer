import './Button.scss'

import { cx } from '../utility/helpers'

export function Text({
    children,
    className = '',
    text,
    variant = '',
    size = 'small',
    ...props
}) {

    return (
        <span data-variant={variant} data-size={size} className={cx('text', className)} {...props}>
            {text} {children}
        </span>
    )
}