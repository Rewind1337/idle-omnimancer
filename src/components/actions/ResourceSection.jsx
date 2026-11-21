import { Flex } from "../Flex"
import { Paper } from "../Paper"
import { Heading } from "../Heading"
import { Item } from "../Item"
import { ITEM_DATA_BY_ID, CURRENCY_DATA_BY_ID } from "../../data/itemData"
import { humanize } from "../../utility/helpers"

const formatOutputRange = (amount, multiplier) => {
    const scaledAmount = Math.max(0, amount * multiplier)
    const minimum = Math.floor(scaledAmount)
    const maximum = scaledAmount - minimum > 0.000001 ? minimum + 1 : minimum
    const format = value => value.toLocaleString()

    return minimum === maximum
        ? format(minimum)
        : format(minimum) + "–" + format(maximum)
}

export function ResourceSection({ title, resources = [], amountMultiplier = 1 }) {
    if (resources.length === 0) return null

    return (
        <Paper layer={2}>
            <Flex direction="column">
                <Heading h="2">{title}</Heading>
                <Flex wrap>
                    {resources.map((resource, index) => {
                        const itemId = typeof resource === "string" ? resource : resource.item
                        const amount = typeof resource === "string" ? 1 : (resource.amount ?? 1)
                        const amountLabel = typeof resource === "string" ? null : resource.amountLabel
                        const data = ITEM_DATA_BY_ID[itemId] ?? CURRENCY_DATA_BY_ID[itemId]
                        const displayAmount = amountLabel ?? (amountMultiplier === 1
                            ? amount
                            : formatOutputRange(amount, amountMultiplier))
                        const className = typeof resource === "string" ? "" : (resource.className ?? "")

                        return (
                            <Item
                                key={itemId + "-" + index}
                                layer={3}
                                className={className}
                                mode="compact"
                                interactive={false}
                                icon={data?.icon}
                                name={data?.name ?? humanize(itemId)}
                                itemId={ITEM_DATA_BY_ID[itemId] ? itemId : null}
                                amount={displayAmount}
                                variant={data?.variant ?? "primary"}
                            />
                        )
                    })}
                </Flex>
            </Flex>
        </Paper>
    )
}
