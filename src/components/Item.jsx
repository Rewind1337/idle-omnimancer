import { Flex } from "./Flex"
import { Paper } from "./Paper"

import './Item.scss'

import { cx } from '../utility/helpers'
import { Text } from "./Text"
import { Tooltip } from "./Tooltip"
import { Icon } from "./Icon"

export function Item({
    className = '',
    icon,
    name,
    amount = null,
    variant = 'primary',
    layer = 2,
    interactive = true,
    onClick = () => { }
}) {
    return (
        <Tooltip layer={layer} variant={variant} content={name}>
            <Paper layer={layer} interactive={interactive}
                className={cx('item', className)}
                data-variant={variant}
                onClick={() => { onClick() }}
            >
                <Flex direction="column" padding={0}>
                    {icon && <Icon variant={variant} className="item-icon">{icon}</Icon>}
                    {amount && <Paper variant={variant} className="item-badge" padding={"2px 6px"}><Text variant={variant}>{amount}</Text></Paper>}
                </Flex>
            </Paper>
        </Tooltip>
    )
}