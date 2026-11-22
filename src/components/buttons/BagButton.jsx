import { OTHER_ICONS } from '../../data/iconLibrary'
import { ITEM_DATA_BY_ID } from '../../data/itemData'
import { GLOBAL_CONFIG } from '../../data/skillConfig'
import { useGameInventory, useGameInventorySlots } from '../../hooks/useGame'
import { Button } from '../Button'

export function BagButton({
    active = false,
    onClick
}) {
    const inventory = useGameInventory()
    const inventorySlots = useGameInventorySlots()
    const occupiedSlots = Object.entries(inventory)
        .filter(([itemId, amount]) => ITEM_DATA_BY_ID[itemId] && amount > 0)
        .length
    const totalSlots = inventorySlots ?? GLOBAL_CONFIG.startingBagSpace

    return (
        <Button
            size="medium"
            variant="primary"
            checked={active}
            onClick={onClick}
            className="w-min"
            badge={`${occupiedSlots} / ${totalSlots}`}
            badgeIcon={OTHER_ICONS.GRIP}
            icon={OTHER_ICONS.ARROW_UP_RIGHT}
        >
            Open Bag
        </Button>
    )
}
