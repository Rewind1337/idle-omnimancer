import { Flex } from "./Flex"
import { Paper } from "./Paper"

import "./Item.scss"
import { cx } from "../utility/helpers"

export function EmptyItem({
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
            hoverable
            data-selected="false"
        >
            <Flex direction="column" align="center" justify="space-between" padding={0}>
                {children}
            </Flex>
        </Paper>
    )
}
