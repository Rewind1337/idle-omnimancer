import './Button.scss'

// utility function that joins the css classes after filtering for truthyness
const cx = (...values) => values.filter(Boolean).join(' ')

export function Heading({
    className = '',
    text,
    variant = '',
    h = '1',
    ...props
}) {
    const Tag = `h${h}`
    return (
        <Tag data-variant={variant} className={cx('heading heading-h' + h, className)} {...props}>
            {text}
        </Tag>
    )
}