import { Flex } from "./Flex"
import { Paper } from "./Paper"
import { Text } from "./Text"

import "./Item.scss"
import { cx } from "../utility/helpers"

export function EmptyItem({
    amount = null,
    children,
    className = "",
    variant = "primary",
    layer = 2,
}) {
    return (
        <Paper
            layer={layer}
            className={cx("item item-empty item-compact", className)}
            data-variant={variant}
            data-selected="false"
        >
            <Flex direction="column" align="center" justify="center" padding={0}>
                {amount !== null && <Text variant={variant}>{amount}</Text>}
                {children}
            </Flex>
        </Paper>
    )
}
