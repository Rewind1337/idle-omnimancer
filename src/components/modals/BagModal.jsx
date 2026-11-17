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

import { ITEM_SPRITES } from '../../data/iconLibrary'
import { SKILL_CONFIGS } from '../../data/skillConfig'
import { humanize } from '../../utility/helpers'
import { useGame } from '../../hooks/useGame'

const getItemVariant = (itemId) => {
    const sourceSkill = SKILL_CONFIGS.find(skill =>
        skill.actions.some(action => {
            const outputs = action.produces ?? action.outputItem ?? []
            return (Array.isArray(outputs) ? outputs : [outputs]).includes(itemId)
        })
    )

    return sourceSkill?.id.split(":")[1] ?? "primary"
}

export function BagModal({
    visible,
    setVisible,
    closeBagButton
}) {
    const { player } = useGame()
    const [selectedItemId, setSelectedItemId] = useState(null)
    const [selectedAmount, setSelectedAmount] = useState(1)

    const inventory = Object.entries(player.inventory ?? {})
        .filter(([, amount]) => amount > 0)
    const occupiedSlots = inventory.length
    const inventorySlots = player.inventorySlots ?? 25
    const emptySlots = Math.max(0, inventorySlots - occupiedSlots)

    const selectedItem = inventory.find(([itemId]) => itemId === selectedItemId)
    const selectedVariant = selectedItem ? getItemVariant(selectedItem[0]) : "primary"
    const selectedMax = selectedItem ? selectedItem[1] : 1

    const handleRangeChange = (event) => {
        setSelectedAmount(Number(event.target.value))
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
                            const variant = getItemVariant(itemId)
                            return (
                                <Item
                                    layer={2}
                                    key={itemId}
                                    icon={ITEM_SPRITES[itemId]}
                                    name={humanize(itemId)}
                                    amount={amount}
                                    variant={variant}
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
                        <EmptyItem>
                            <Heading h="6" className="align-center">+1 Slot</Heading>
                            <Button variant="shop" size="small" className="w-100 align-center">Buy</Button>
                        </EmptyItem>
                    </Flex>

                    {selectedItem && (
                        <Paper layer={2} className="bag-item-selection">
                            <Flex direction="column" gap={12}>
                                <Item
                                    layer={3}
                                    mode="wide"
                                    interactive={false}
                                    icon={ITEM_SPRITES[selectedItem[0]]}
                                    name={humanize(selectedItem[0])}
                                    amount={selectedAmount}
                                    variant={selectedVariant}
                                />
                                <InputRange
                                    variant={selectedVariant}
                                    value={selectedAmount}
                                    onChange={handleRangeChange}
                                    label="Amount"
                                    min={1}
                                    max={selectedMax}
                                />
                            </Flex>
                        </Paper>
                    )}
                </Flex>
            }
        />
    )
}
