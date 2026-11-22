import { Modal } from "../Modal"
import { Heading } from "../Heading"
import { Text } from "../Text"
import { Flex } from "../Flex"
import { Paper } from "../Paper"
import { Item } from "../Item"
import { Button } from "../Button"

export function SelectionModal({
    visible,
    onClose,
    items = [],
    selectedItemId = null,
    onSelect,
    variant = "unveiling",
}) {
    if (!visible) return null

    return (
        <Modal
            visible={visible}
            variant={variant}
            className="modal-selection"
            onBackdropClick={onClose}
            header={<Heading h="1">Choose Items</Heading>}
            footer={<Button variant={variant} onClick={onClose}>Close</Button>}
            content={
                <Flex direction="column" gap={12}>
                    <Text size="small">
                        Choose one item to consume each time this action completes.
                    </Text>
                    {items.length > 0 ? (
                        <Paper layer={2}>
                            <Flex wrap gap={8}>
                                {items.map(item => (
                                    <Item
                                        key={item.id}
                                        layer={3}
                                        mode="wide"
                                        interactive
                                        icon={item.icon}
                                        name={item.name}
                                        itemId={item.id}
                                        amount={item.amount}
                                        variant={item.variant ?? variant}
                                        selected={selectedItemId === item.id}
                                        onClick={() => {
                                            onSelect(item.id)
                                            onClose()
                                        }}
                                    />
                                ))}
                            </Flex>
                        </Paper>
                    ) : (
                        <Text size="small" className="align-center">
                            You don't currently have any eligible items.
                        </Text>
                    )}
                </Flex>
            }
        />
    )
}
