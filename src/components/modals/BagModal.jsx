import '../Modal.scss'

import { Modal } from '../Modal'
import { Heading } from '../Heading'
import { Flex } from '../Flex'
import { Grid } from '../Grid'
import { Item } from '../Item'

import { ITEM_SPRITES } from '../../data/iconLibrary'
import { humanize } from '../../utility/helpers'
import { useGame } from '../../hooks/useGame'

export function BagModal({
    visible,
    setVisible,
    closeBagButton
}) {
    const { player } = useGame()
    const inventory = Object.entries(player.inventory ?? {})
        .filter(([, amount]) => amount > 0)

    return (
        <Modal
            visible={visible}
            variant="transmutation"
            onBackdropClick={() => { setVisible(false) }}
            header={<Heading h="1">Bag</Heading>}
            footer={closeBagButton}
            content={
                <Flex direction="column">
                    {inventory.length > 0 ? (
                        <Grid columns={{ xsmall: 2, small: 3, medium: 4, large: 6 }}>
                            {inventory.map(([itemId, amount]) => (
                                <Item
                                    key={itemId}
                                    icon={ITEM_SPRITES[itemId]}
                                    name={humanize(itemId)}
                                    amount={amount}
                                    variant="transmutation"
                                />
                            ))}
                        </Grid>
                    ) : (
                        <p>Your bag is empty.</p>
                    )}
                </Flex>
            }
        />
    )
}