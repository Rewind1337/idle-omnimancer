import { memo, useCallback, useMemo, useState } from "react"

import '../Modal.scss'
import "./BagModal.scss"

import { Modal } from '../Modal'
import { Heading } from '../Heading'
import { Text } from '../Text'
import { Flex } from '../Flex'
import { Paper } from '../Paper'
import { Item } from '../Item'
import { EmptyItem } from '../EmptyItem'
import { Button } from '../Button'
import { InputRange } from '../InputRange'
import { Tooltip } from '../Tooltip'
import { Icon } from '../Icon'

import { OTHER_ICONS, SHOP_ICONS, SKILL_ICONS } from '../../data/iconLibrary'

import { ITEM_DATA_BY_ID } from '../../data/itemData'
import { getNextBagSlotCost } from '../../game/gameEngine'
import { humanize } from '../../utility/helpers'
import {
    useGameActions,
    useGameCurrencies,
    useGameInventory,
    useGameInventorySlots,
} from '../../hooks/useGame'
import { GLOBAL_CONFIG } from "../../data/skillConfig"

const AMOUNT_PRESETS = [
    { label: "1%", ratio: 0.01 },
    { label: "10%", ratio: 0.10 },
    { label: "50%", ratio: 0.50 },
    { label: "100%", ratio: 1 },
]

const BAG_GROUP_FILTERS = [
    { id: "all", label: "All", icon: OTHER_ICONS.SPARKLES, variant: "primary" },
    { id: "research", label: "Research", icon: SKILL_ICONS.RESEARCH, variant: "research" },
    { id: "spellcraft", label: "Spellcraft", icon: SKILL_ICONS.SPELLCRAFT, variant: "spellcraft" },
    { id: "transmutation", label: "Transmutation", icon: SKILL_ICONS.TRANSMUTATION, variant: "transmutation" },
    { id: "exploration", label: "Exploration", icon: SKILL_ICONS.EXPLORATION, variant: "exploration" },
    { id: "combat", label: "Combat", icon: SKILL_ICONS.COMBAT, variant: "combat" },
    { id: "companions", label: "Companions", icon: SKILL_ICONS.COMPANIONS, variant: "companions" },
    { id: "shop", label: "Shop", icon: SHOP_ICONS.GENERAL_GOODS, variant: "shop" },
]

const BagInventoryItem = memo(function BagInventoryItem({
    itemId,
    amount,
    selected,
    onSelect,
}) {
    const itemData = ITEM_DATA_BY_ID[itemId]
    const handleClick = useCallback(() => onSelect(itemId), [itemId, onSelect])

    return (
        <Item
            layer={3}
            className="bag-inventory-item"
            icon={itemData?.icon}
            name={itemData?.name ?? humanize(itemId)}
            itemId={itemId}
            amount={amount}
            variant={itemData?.variant ?? "primary"}
            selected={selected}
            onClick={handleClick}
        />
    )
})

function BagModalContent({
    closeBagButton,
    onClose,
    selectedItemId,
    selectedAmount,
    setSelectedItemId,
    setSelectedAmount,
    onSelectItem,
    onDeselect,
}) {
    const [activeGroup, setActiveGroup] = useState("all")
    const inventory = useGameInventory()
    const currencies = useGameCurrencies()
    const storedInventorySlots = useGameInventorySlots()
    const { buyBagSlot, sellItem } = useGameActions()

    const inventoryEntries = useMemo(() => Object.entries(inventory)
        .filter(([itemId, amount]) => ITEM_DATA_BY_ID[itemId] && amount > 0), [inventory])
    const filteredInventoryEntries = useMemo(() => activeGroup === "all"
        ? inventoryEntries
        : inventoryEntries.filter(([itemId]) => ITEM_DATA_BY_ID[itemId]?.group === activeGroup),
    [activeGroup, inventoryEntries])
    const totalBagValue = useMemo(() => inventoryEntries.reduce((total, [itemId, amount]) =>
        total + amount * (ITEM_DATA_BY_ID[itemId]?.baseValue ?? 0), 0), [inventoryEntries])
    const occupiedSlots = inventoryEntries.length
    const inventorySlots = storedInventorySlots ?? GLOBAL_CONFIG.startingBagSpace
    const emptySlots = Math.max(0, inventorySlots - occupiedSlots)

    const selectedItem = inventoryEntries.find(([itemId]) => itemId === selectedItemId)
    const selectedData = selectedItem ? ITEM_DATA_BY_ID[selectedItem[0]] : null
    const selectedVariant = selectedData?.variant ?? "primary"
    const selectedMax = selectedItem ? selectedItem[1] : 1
    const amountToSell = Math.max(1, Math.min(selectedAmount, selectedMax))
    const baseValue = selectedData?.baseValue ?? 0
    const totalSellValue = amountToSell * baseValue

    const nextSlotCost = getNextBagSlotCost(inventorySlots)
    const coins = currencies.coins ?? 0

    const handleGroupChange = useCallback((groupId) => {
        setActiveGroup(groupId)
        if (
            selectedItemId &&
            groupId !== "all" &&
            ITEM_DATA_BY_ID[selectedItemId]?.group !== groupId
        ) {
            onDeselect()
        }
    }, [onDeselect, selectedItemId])

    const handleRangeChange = useCallback((event) => {
        const value = Number(event.target.value)
        setSelectedAmount(Math.max(1, Math.min(selectedMax, value)))
    }, [selectedMax, setSelectedAmount])

    const handlePreset = useCallback((ratio) => {
        setSelectedAmount(Math.max(1, Math.min(selectedMax, Math.ceil(selectedMax * ratio))))
    }, [selectedMax, setSelectedAmount])

    const handleSell = useCallback(() => {
        if (!selectedItem || amountToSell > selectedMax) return

        sellItem(selectedItem[0], amountToSell)

        if (amountToSell >= selectedMax) {
            setSelectedItemId(null)
            setSelectedAmount(1)
        } else {
            setSelectedAmount(Math.min(amountToSell, selectedMax - amountToSell))
        }
    }, [
        amountToSell,
        selectedItem,
        selectedMax,
        sellItem,
        setSelectedAmount,
        setSelectedItemId,
    ])

    return (
        <Modal
            visible
            variant={null}
            className="modal-bag"
            onBackdropClick={onClose}
            header={<Heading h="1">Bag</Heading>}
            footer={closeBagButton}
            content={
                <Flex direction="column" gap={16}>
                    <Flex direction="row" align="center" gap={6} className="bag-total-value">
                        <Icon size={18} variant="shop">{OTHER_ICONS.COINS}</Icon>
                        <span>Total bag value: {totalBagValue.toLocaleString()} {totalBagValue === 1 ? "coin" : "coins"}</span>
                    </Flex>

                    <Flex direction="row" wrap gap={6} className="bag-group-filters">
                        {BAG_GROUP_FILTERS.map(group => (
                            <Button
                                key={group.id}
                                variant={group.variant}
                                size="small"
                                icon={group.icon}
                                checked={activeGroup === group.id}
                                className="bag-group-filter"
                                onClick={() => handleGroupChange(group.id)}
                            >
                                {group.label}
                            </Button>
                        ))}
                    </Flex>

                    <Paper
                        layer={2}
                        className="bag-inventory"
                        onClick={(event) => {
                            if (event.target.closest?.(".bag-inventory-item")) return
                            onDeselect()
                        }}
                    >
                        <Flex direction="row" wrap>
                            {filteredInventoryEntries.map(([itemId, amount]) => (
                                <BagInventoryItem
                                    key={itemId}
                                    itemId={itemId}
                                    amount={amount}
                                    selected={selectedItemId === itemId}
                                    onSelect={onSelectItem}
                                />
                            ))}
                            {filteredInventoryEntries.length === 0 && (
                                <Text size="small" className="bag-inventory-empty">
                                    {activeGroup === "all"
                                        ? "Your bag is empty."
                                        : "No " + BAG_GROUP_FILTERS.find(group => group.id === activeGroup)?.label.toLowerCase() + " items in your bag."}
                                </Text>
                            )}
                            {emptySlots > 0 && (
                                <EmptyItem layer={3}>
                                    <Heading h="6" className="align-center">Free Slots</Heading>
                                    <Heading h="3" className="align-center">{emptySlots}</Heading>
                                </EmptyItem>
                            )}
                            <EmptyItem layer={3} variant="shop" className="bag-buy-slot" padding={0}>
                                <Tooltip block
                                    variant="shop"
                                    content={<Heading h="5">Cost: {nextSlotCost.toLocaleString()} coins</Heading>}
                                >
                                    <Button
                                        variant="shop"
                                        size="small"
                                        className="w-100 bag-buy-slot-button"
                                        style={{ width: "100%", height: "100%" }}
                                        disabled={coins < nextSlotCost}
                                        onClick={buyBagSlot}
                                    >
                                        Buy
                                    </Button>
                                </Tooltip>
                            </EmptyItem>
                        </Flex>
                    </Paper>

                    {selectedItem && selectedData ? (
                        <Paper layer={2} className="bag-item-selection">
                            <Flex direction="column" gap={12}>
                                <Heading h="3">{selectedData.name}</Heading>
                                <Flex direction="row" justify="center" align="center">
                                    <Item
                                        layer={3}
                                        mode="compact"
                                        interactive={false}
                                        icon={selectedData.icon}
                                        name={selectedData.name}
                                        itemId={selectedItem[0]}
                                        amount={amountToSell}
                                        variant={selectedVariant}
                                    />
                                    <InputRange
                                        variant={"primary"}
                                        value={amountToSell}
                                        onChange={handleRangeChange}
                                        label="Amount"
                                        layer={2}
                                        min={1}
                                        max={selectedMax}
                                    />
                                </Flex>

                                <Flex direction="row" justify="space-between" align="center" wrap>
                                    <Flex direction="row" align="center" gap={4}>
                                        <Icon size={18} variant="shop">{OTHER_ICONS.COINS}</Icon>
                                        <span>Total sell value: {totalSellValue.toLocaleString()} {totalSellValue === 1 ? "coin" : "coins"}</span>
                                    </Flex>
                                    <Flex direction="row" align="center" gap={4}>
                                        <Icon size={18} variant="shop">{OTHER_ICONS.COINS}</Icon>
                                        <span>{baseValue.toLocaleString()} {baseValue === 1 ? "coin" : "coins"} each</span>
                                    </Flex>
                                </Flex>

                                <Flex direction="row" gap={8} wrap>
                                    <Button variant="primary" onClick={onDeselect}>
                                        Deselect
                                    </Button>
                                    {AMOUNT_PRESETS.map(({ label, ratio }) => {
                                        const presetAmount = Math.max(
                                            1,
                                            Math.min(selectedMax, Math.ceil(selectedMax * ratio))
                                        )
                                        return (
                                            <Button
                                                key={label}
                                                variant={"primary"}
                                                size="medium"
                                                className="w-10 flex-grow"
                                                checked={amountToSell === presetAmount}
                                                onClick={() => handlePreset(ratio)}
                                            >
                                                {label}
                                            </Button>
                                        )
                                    })}
                                    <Button
                                        variant="shop"
                                        className="w-20 flex-grow"
                                        disabled={baseValue <= 0 || amountToSell < 1}
                                        onClick={handleSell}
                                    >
                                        Sell for {totalSellValue.toLocaleString()} Coins
                                    </Button>
                                </Flex>
                            </Flex>
                        </Paper>
                    ) : (
                        <Paper layer={2} className="bag-item-selection">
                            <Text size="small" className="w-100 align-center">
                                Select an item to start selling.
                            </Text>
                        </Paper>
                    )}
                </Flex>
            }
        />
    )
}

export const BagModal = memo(function BagModal({
    visible,
    setVisible,
    closeBagButton,
}) {
    const [selectedItemId, setSelectedItemId] = useState(null)
    const [selectedAmount, setSelectedAmount] = useState(1)

    const handleSelectItem = useCallback((itemId) => {
        setSelectedItemId(itemId)
        setSelectedAmount(1)
    }, [])

    const handleDeselect = useCallback(() => {
        setSelectedItemId(null)
        setSelectedAmount(1)
    }, [])

    const handleClose = useCallback(() => setVisible(false), [setVisible])

    // Keep only the selection state mounted while closed. Expensive inventory
    // subscriptions and item rows are mounted only for an open Bag.
    if (!visible) return null

    return (
        <BagModalContent
            onClose={handleClose}
            closeBagButton={closeBagButton}
            selectedItemId={selectedItemId}
            selectedAmount={selectedAmount}
            setSelectedItemId={setSelectedItemId}
            setSelectedAmount={setSelectedAmount}
            onSelectItem={handleSelectItem}
            onDeselect={handleDeselect}
        />
    )
})
