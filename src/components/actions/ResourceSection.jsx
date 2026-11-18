import { Flex } from "../Flex"
import { Paper } from "../Paper"
import { Heading } from "../Heading"
import { Item } from "../Item"
import { ITEM_DATA_BY_ID, CURRENCY_DATA_BY_ID } from "../../data/itemData"
import { humanize } from "../../utility/helpers"

export function ResourceSection({ title, resources = [] }) {
    if (resources.length === 0) return null

    return (
        <Paper layer={2}>
            <Flex direction="column">
                <Heading h="2">{title}</Heading>
                <Flex wrap>
                    {resources.map(resource => {
                        const itemId = typeof resource === "string" ? resource : resource.item
                        const amount = typeof resource === "string" ? 1 : (resource.amount ?? 1)
                        const data = ITEM_DATA_BY_ID[itemId] ?? CURRENCY_DATA_BY_ID[itemId]

                        return (
                            <Item
                                key={itemId}
                                layer={3}
                                mode="compact"
                                interactive={false}
                                icon={data?.icon}
                                name={data?.name ?? humanize(itemId)}
                                itemId={ITEM_DATA_BY_ID[itemId] ? itemId : null}
                                amount={amount}
                                variant={data?.variant ?? "primary"}
                            />
                        )
                    })}
                </Flex>
            </Flex>
        </Paper>
    )
}
