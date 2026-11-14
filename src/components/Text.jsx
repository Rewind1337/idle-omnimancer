import './Button.scss'

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function Text({
    children,
    className = '',
    text,
    variant = '',
    size = 'small',
    ...props
}) {

    return (
        <p data-variant={variant} data-size={size} className={cx('text', className)} {...props}>
            {text} {children}
        </p>
    )
}