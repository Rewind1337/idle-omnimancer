import { useState } from "react"

import '../Modal.scss'

import { Modal } from '../Modal'
import { Heading } from '../Heading'
import { Flex } from '../Flex'
import { Paper } from '../Paper'
import { Item } from '../Item'
import { EmptyItem } from '../EmptyItem'
import { Button } from '../Button'
import { InputRange } from '../InputRange'
import { Tooltip } from '../Tooltip'
import { Icon } from '../Icon'

import { OTHER_ICONS } from '../../data/iconLibrary'

import { ITEM_DATA_BY_ID } from '../../data/itemData'
import { getNextBagSlotCost } from '../../game/gameEngine'
import { humanize } from '../../utility/helpers'
import { useGame } from '../../hooks/useGame'
import { GLOBAL_CONFIG } from "../../data/skillConfig"

const AMOUNT_PRESETS = [
    { label: "1%", ratio: 0.01 },
    { label: "10%", ratio: 0.10 },
    { label: "50%", ratio: 0.50 },
    { label: "100%", ratio: 1 },
]

export function BagModal({
    visible,
    setVisible,
    closeBagButton
}) {
    const { player, buyBagSlot, sellItem } = useGame()
    const [selectedItemId, setSelectedItemId] = useState(null)
    const [selectedAmount, setSelectedAmount] = useState(1)

    const inventory = Object.entries(player.inventory ?? {})
        .filter(([itemId, amount]) => ITEM_DATA_BY_ID[itemId] && amount > 0)
    const occupiedSlots = inventory.length
    const inventorySlots = player.inventorySlots ?? GLOBAL_CONFIG.startingBagSpace
    const emptySlots = Math.max(0, inventorySlots - occupiedSlots)

    const selectedItem = inventory.find(([itemId]) => itemId === selectedItemId)
    const selectedData = selectedItem ? ITEM_DATA_BY_ID[selectedItem[0]] : null
    const selectedVariant = selectedData?.variant ?? "primary"
    const selectedMax = selectedItem ? selectedItem[1] : 1
    const amountToSell = Math.max(1, Math.min(selectedAmount, selectedMax))
    const baseValue = selectedData?.baseValue ?? 0
    const totalSellValue = amountToSell * baseValue

    const nextSlotCost = getNextBagSlotCost(inventorySlots)
    const coins = player.currencies?.coins ?? 0

    const handleRangeChange = (event) => {
        const value = Number(event.target.value)
        setSelectedAmount(Math.max(1, Math.min(selectedMax, value)))
    }

    const handlePreset = (ratio) => {
        setSelectedAmount(Math.max(1, Math.min(selectedMax, Math.ceil(selectedMax * ratio))))
    }

    const handleSell = () => {
        if (!selectedItem || amountToSell > selectedMax) return

        sellItem(selectedItem[0], amountToSell)

        if (amountToSell >= selectedMax) {
            setSelectedItemId(null)
            setSelectedAmount(1)
        } else {
            setSelectedAmount(Math.min(amountToSell, selectedMax - amountToSell))
        }
    }

    return (
        <Modal
            visible={visible}
            variant={null}
            onBackdropClick={() => { setVisible(false) }}
            header={<Heading h="1">Bag</Heading>}
            footer={closeBagButton}
            content={
                <Flex direction="column" gap={16}>
                    <Flex direction="row" wrap>
                        {inventory.map(([itemId, amount]) => {
                            const itemData = ITEM_DATA_BY_ID[itemId]
                            return (
                                <Item
                                    layer={2}
                                    key={itemId}
                                    icon={itemData?.icon}
                                    name={itemData?.name ?? humanize(itemId)}
                                    amount={amount}
                                    variant={itemData?.variant ?? "primary"}
                                    selected={selectedItemId === itemId}
                                    onClick={() => {
                                        setSelectedItemId(itemId)
                                        setSelectedAmount(1)
                                    }}
                                />
                            )
                        })}
                        {emptySlots > 0 && (
                            <EmptyItem>
                                <Heading h="6" className="align-center">Free Slots</Heading>
                                <Heading h="3" className="align-center">{emptySlots}</Heading>
                            </EmptyItem>
                        )}
                        <EmptyItem variant="shop" className="bag-buy-slot" padding={0}>
                            <Tooltip block
                                variant="shop"
                                content={<Heading h="5">{`Cost: ${nextSlotCost.toLocaleString()} coins`}</Heading>}
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

                    {selectedItem && selectedData && (
                        <Paper layer={2} className="bag-item-selection">
                            <Flex direction="column" gap={12}>
                                <Item
                                    layer={3}
                                    mode="wide"
                                    interactive={false}
                                    icon={selectedData.icon}
                                    name={selectedData.name}
                                    amount={amountToSell}
                                    variant={selectedVariant}
                                />

                                <InputRange
                                    variant={"primary"}
                                    value={amountToSell}
                                    onChange={handleRangeChange}
                                    label="Amount"
                                    min={1}
                                    max={selectedMax}
                                />

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
                                        className="w-10 flex-grow"
                                        disabled={baseValue <= 0 || amountToSell < 1}
                                        onClick={handleSell}
                                    >
                                        Sell {amountToSell.toLocaleString()}
                                    </Button>
                                </Flex>
                            </Flex>
                        </Paper>
                    )}
                </Flex>
            }
        />
    )
}
