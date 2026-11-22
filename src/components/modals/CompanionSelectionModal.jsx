import { Button } from "../Button"
import { Flex } from "../Flex"
import { Heading } from "../Heading"
import { Icon } from "../Icon"
import { Modal } from "../Modal"
import { Paper } from "../Paper"
import { Text } from "../Text"

import { ITEM_DATA_BY_ID } from "../../data/itemData"

export function CompanionSelectionModal({
    element,
    companions = [],
    selectedCompanionId = null,
    onSelect,
    onClose,
}) {
    if (!element) return null

    return (
        <Modal
            visible={Boolean(element)}
            variant={element}
            className="modal-companion-selection"
            onBackdropClick={onClose}
            header={<Heading h="2">Choose {element.charAt(0).toUpperCase() + element.slice(1)} Companion</Heading>}
            footer={<Button variant={element} onClick={onClose}>Close</Button>}
            content={
                <Flex direction="column" gap={10}>
                    {companions.length > 0 ? companions.map(companion => (
                        <Paper key={companion.id} layer={2} variant={element}>
                            <Button
                                variant={element}
                                className="w-100 companion-selection-option"
                                toggled={selectedCompanionId === companion.id}
                                onClick={() => {
                                    onSelect(companion.id)
                                    onClose()
                                }}
                            >
                                <Flex direction="row" align="center" gap={10}>
                                    <Icon size={36} variant={element}>
                                        {ITEM_DATA_BY_ID[companion.containerId]?.icon}
                                    </Icon>
                                    <Flex direction="column" align="start" gap={2}>
                                        <Heading h="3">{companion.name}</Heading>
                                        <Text size="small">Tier {companion.tier}</Text>
                                    </Flex>
                                </Flex>
                            </Button>
                        </Paper>
                    )) : (
                        <Text size="small">You haven't discovered an {element} companion yet.</Text>
                    )}
                    {selectedCompanionId && (
                        <Button
                            variant="transparent"
                            size="medium"
                            onClick={() => {
                                onSelect(null)
                                onClose()
                            }}
                        >
                            Clear Slot
                        </Button>
                    )}
                </Flex>
            }
        />
    )
}
