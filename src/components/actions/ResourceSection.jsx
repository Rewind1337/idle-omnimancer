import { Flex } from "../Flex"
import { Paper } from "../Paper"
import { Heading } from "../Heading"
import { Item } from "../Item"
import { ITEM_DATA_BY_ID, CURRENCY_DATA_BY_ID } from "../../data/itemData"
import { humanize } from "../../utility/helpers"

const formatOutputChance = fraction =>
    Number((fraction * 100).toFixed(4)).toLocaleString() + "%"

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
                        const className = typeof resource === "string" ? "" : (resource.className ?? "")
                        const name = data?.name ?? humanize(itemId)
                        const itemIdForTooltip = ITEM_DATA_BY_ID[itemId] ? itemId : null

                        const renderItem = (displayAmount, suffix) => (
                            <Item
                                key={itemId + "-" + index + suffix}
                                layer={3}
                                className={className}
                                mode="compact"
                                interactive={false}
                                icon={data?.icon}
                                name={name}
                                itemId={itemIdForTooltip}
                                amount={displayAmount}
                                variant={data?.variant ?? "primary"}
                            />
                        )

                        if (amountLabel != null) {
                            return renderItem(amountLabel, "-label")
                        }

                        const scaledAmount = Math.max(0, amount * amountMultiplier)
                        const stableAmount = Number(scaledAmount.toFixed(8))
                        const guaranteedAmount = Math.floor(stableAmount)
                        const fractionalAmount = Number((stableAmount - guaranteedAmount).toFixed(8))
                        const entries = []

                        if (guaranteedAmount > 0) {
                            entries.push(renderItem(guaranteedAmount, "-guaranteed"))
                        }
                        if (fractionalAmount > 0) {
                            entries.push(renderItem(formatOutputChance(fractionalAmount), "-chance"))
                        }

                        return entries
                    })}
                </Flex>
            </Flex>
        </Paper>
    )
}
