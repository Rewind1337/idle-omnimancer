import { Flex } from "./Flex"
import { Paper } from "./Paper"

import './Item.scss'

import { cx } from '../utility/helpers'
import { Text } from "./Text"
import { Tooltip } from "./Tooltip"
import { Icon } from "./Icon"
import { Heading } from "./Heading"

export function Item({
    className = '',
    icon,
    name,
    mode = "compact",
    amount = null,
    variant = 'primary',
    layer = 2,
    interactive = true,
    selected = false,
    onClick = () => { }
}) {
    if (mode === "compact") {
        return (
            <Tooltip layer={layer} variant={variant} content={<Heading h="5">{name}</Heading>}>
                <Paper layer={layer} interactive={interactive}
                    className={cx('item item-compact', className)}
                    data-selected={selected ? "true" : "false"}
                    onClick={() => { onClick() }}
                >
                    <Flex direction="column" padding={0}>
                        {icon && <Icon variant={variant} className="item-icon">{icon}</Icon>}
                        {amount && <Paper className="item-badge" padding={"2px 6px"}><Text>{amount}</Text></Paper>}
                    </Flex>
                </Paper>
            </Tooltip>
        )
    } else if (mode === "wide") {
        return (
            <Paper layer={layer} interactive={interactive}
                className={cx('item item-wide clip-overflow', className)}
                data-variant={variant}
                data-selected={selected ? "true" : "false"}
                onClick={() => { onClick() }}
            >
                <Flex direction="row" padding={0}>
                    <Flex direction="column" padding={0}>
                        {icon && <Icon variant={variant} className="item-icon">{icon}</Icon>}
                        {amount && <Paper className="item-badge" padding={"2px 6px"}><Text>{amount}</Text></Paper>}
                    </Flex>
                    <Paper className="item-name" variant={variant}><Text>{name}</Text></Paper>
                </Flex>
            </Paper>
        )
    }
}