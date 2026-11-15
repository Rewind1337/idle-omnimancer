import { Button } from './Button'
import { Flex } from './Flex'
import { Grid } from './Grid'

// Utility function that joins CSS classes after filtering for truthiness.
const cx = (...values) => values.filter(Boolean).join(' ')

export function Tabs({
    tabs = [],
    value,
    onChange,
    variant = 'primary',
    size = 'medium',
    direction = 'row',
    wrap = false,
    columns = null,
    gap = 8,
    className = '',
    ...props
}) {
    const tabButtons = tabs.map(tab => {
        // Allow both simple string values and tab objects.
        const option = typeof tab === 'object'
            ? tab
            : { value: tab, label: tab }

        const tabValue = option.value ?? option.id
        const tabLabel = option.label ?? option.name ?? String(tabValue)
        const isActive = value === tabValue

        return (
            <Button
                key={tabValue}
                variant={option.variant ?? variant}
                size={option.size ?? size}
                icon={option.icon}
                badge={option.badge ?? option.level ?? null}
                checked={isActive}
                disabled={option.disabled ?? false}
                className={cx('tab', option.className)}
                onClick={() => {
                    if (!isActive) {
                        onChange?.(tabValue)
                    }
                }}
            >
                {tabLabel}
            </Button>
        )
    })

    const layoutProps = {
        className: cx('tabs', className),
        gap,
        padding: 0,
        role: 'group',
        ...props
    }

    // Use Grid when responsive column definitions are supplied.
    if (columns) {
        return (
            <Grid columns={columns} {...layoutProps}>
                {tabButtons}
            </Grid>
        )
    }

    return (
        <Flex
            direction={direction}
            wrap={wrap}
            {...layoutProps}
        >
            {tabButtons}
        </Flex>
    )
}