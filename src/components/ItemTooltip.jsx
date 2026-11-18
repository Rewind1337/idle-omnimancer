import { Flex } from "./Flex"
import { Heading } from "./Heading"
import { Text } from "./Text"

import { ITEM_DATA_BY_ID } from "../data/itemData"
import { getItemActionSources } from "../game/gameEngine"
import { useGame } from "../hooks/useGame"

import "./ItemTooltip.scss"

const formatAmount = amount =>
    Number(amount).toLocaleString()

function ItemActionList({ title, actions, emptyLabel }) {
    return (
        <Flex direction="column" align="start" gap={6} className="item-tooltip-section">
            <Heading h="5">{title}</Heading>
            {actions.length > 0 ? actions.map(action => (
                <Flex key={action.id} direction="column" align="start" gap={2} className="item-tooltip-action">
                    <Heading h="6" weight={500}>{action.name}</Heading>
                    <Text size="small">
                        Base amount: {formatAmount(action.amount)} {action.type === "unlock" ? "to unlock" : "per completion"}
                    </Text>
                </Flex>
            )) : (
                <Text size="small">{emptyLabel}</Text>
            )}
        </Flex>
    )
}

export function ItemTooltip({ itemId, name }) {
    const { player } = useGame()
    const itemData = ITEM_DATA_BY_ID[itemId]
    const amountHeld = player.inventory?.[itemId] ?? 0
    const { obtainedBy, consumedBy } = getItemActionSources(itemId)

    return (
        <Flex direction="column" align="start" gap={8} className="item-tooltip">
            <Heading h="4">{name ?? itemData?.name ?? "Unknown Item"}</Heading>

            <Flex direction="column" align="start" gap={2} className="item-tooltip-summary">
                <Text>Amount held: {formatAmount(amountHeld)}</Text>
                <Text>
                    Sell value (1 item): {formatAmount(itemData?.baseValue ?? 0)} Coins
                </Text>
            </Flex>

            <div className="divider tooltip-divider"></div>

            <ItemActionList
                title="Obtaining"
                actions={obtainedBy}
                emptyLabel="No configured actions produce this item."
            />

            <div className="divider tooltip-divider"></div>

            <ItemActionList
                title="Consuming"
                actions={consumedBy}
                emptyLabel="No configured actions or unlocks consume this item."
            />
        </Flex>
    )
}
