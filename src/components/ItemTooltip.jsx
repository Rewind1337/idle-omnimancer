import { Flex } from "./Flex"
import { EffectStack } from "./EffectStack"
import { Heading } from "./Heading"
import { Text } from "./Text"

import { ITEM_DATA_BY_ID } from "../data/itemData"
import { getArtifactEffectDefinitionEntries, getItemActionSources, getSellValueMultiplier } from "../game/gameEngine"
import { useGame } from "../hooks/useGame"
import { Badge } from "./Badge"

import "./ItemTooltip.scss"
import { OTHER_ICONS } from "../data/iconLibrary"
import { formatCompactNumber } from "../utility/helpers"

const formatAmount = amount =>
    Number(amount).toLocaleString()

// Item source records depend on this discrete player snapshot and the item,
// not on inventory quantities. A tooltip opened again can reuse the result.
const itemActionSourcesCache = new WeakMap()

const getCachedItemActionSources = (itemId, player) => {
    let playerCache = itemActionSourcesCache.get(player)
    if (!playerCache) {
        playerCache = new Map()
        itemActionSourcesCache.set(player, playerCache)
    }

    if (!playerCache.has(itemId)) {
        playerCache.set(itemId, getItemActionSources(itemId, player))
    }

    return playerCache.get(itemId)
}

function ItemActionList({ title, actions, emptyLabel }) {
    return (
        <Flex direction="column" align="start" gap={4} className="item-tooltip-section">
            <Heading h="4" className="w-100 align-center">{title}</Heading>
            {actions.length > 0 ? actions.map(action => (
                <Flex key={action.id} direction="row" align="center" justify="start" gap={8} className="item-tooltip-action">
                    <Badge size="small" variant={action.badgeVariant}>{action.type}</Badge>
                    <Heading h="5" weight={400} className="align-left flex-grow">{action.name}</Heading>
                    <Heading h="5" size="small">
                        {action.amountLabel ?? formatAmount(action.amount)}
                    </Heading>
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
    const sellValue = (itemData?.baseValue ?? 0) * getSellValueMultiplier(player)
    const { obtainedBy, consumedBy } = getCachedItemActionSources(itemId, player)
    const artifactEffects = itemData?.type === "artifact"
        ? getArtifactEffectDefinitionEntries(itemData)
        : []

    return (
        <Flex direction="column" align="start" gap={8} className="item-tooltip">
            <Heading h="3" className="w-100 align-center">{name ?? itemData?.name ?? "Unknown Item"}</Heading>

            <Flex direction="column" align="start" gap={4} className="item-tooltip-summary">
                <Flex direction="row" align="center" justify="space-between">
                    <Heading h="5" className="w-70">Sell value each:</Heading>
                    <Flex direction="row" align="end" justify="end">
                        <Heading h="5">{formatAmount(sellValue)}</Heading>
                        {OTHER_ICONS.COINS}
                    </Flex>
                </Flex>
                <Flex direction="row" align="center" justify="space-between">
                    <Heading h="5" className="w-70">Amount held:</Heading>
                    <Flex direction="row" align="end" justify="end">
                        <Heading h="5">{formatAmount(amountHeld)}</Heading>
                        {OTHER_ICONS.GRIP}
                    </Flex>
                </Flex>
                <Flex direction="row" align="center" justify="space-between">
                    <Heading h="5" className="w-70">Sell value stack ({formatCompactNumber(amountHeld)}):</Heading>
                    <Flex direction="row" align="end" justify="end">
                        <Heading h="5">{formatAmount(sellValue * amountHeld)}</Heading>
                        {OTHER_ICONS.COINS}
                    </Flex>
                </Flex>
            </Flex>

            {Number.isFinite(itemData?.requiredUnveilingLevel) && (
                <Flex direction="row" align="center" justify="space-between" className="item-tooltip-requirement">
                    <Heading h="5">Unveiling requirement:</Heading>
                    <Badge variant="unveiling">Requires Unveiling {itemData.requiredUnveilingLevel}</Badge>
                </Flex>
            )}

            {itemData?.type === "artifact" && (
                <>
                    <hr />
                    <EffectStack
                        title="Artifact Effects"
                        entries={artifactEffects}
                        emptyLabel="No effects assigned."
                    />
                </>
            )}

            <hr />

            <ItemActionList
                title="Obtaining"
                actions={obtainedBy}
                emptyLabel="No configured sources."
            />

            <hr />

            <ItemActionList
                title="Consuming"
                actions={consumedBy}
                emptyLabel="Not consumed by any action or unlock."
            />
        </Flex>
    )
}
