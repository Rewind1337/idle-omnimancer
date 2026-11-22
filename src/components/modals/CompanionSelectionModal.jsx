import { Button } from "../Button"
import { Flex } from "../Flex"
import { Heading } from "../Heading"
import { Icon } from "../Icon"
import { Modal } from "../Modal"
import { Paper } from "../Paper"
import { Text } from "../Text"


export function CompanionSelectionModal({
    slotId,
    slotLabel = "Any Element",
    variant = "companions",
    companions = [],
    selectedCompanionId = null,
    onSelect,
    onClose,
}) {
    if (!slotId) return null

    return (
        <Modal
            visible={Boolean(slotId)}
            variant={variant}
            className="modal-companion-selection"
            onBackdropClick={onClose}
            header={<Heading h="2">Choose for {slotLabel}</Heading>}
            footer={<Button variant={variant} onClick={onClose}>Close</Button>}
            content={
                <Flex direction="column" gap={10}>
                    {companions.length > 0 ? companions.map(companion => (
                        <Paper key={companion.id} layer={2} variant={companion.element}>
                            <Button
                                variant={companion.element}
                                className="w-100 companion-selection-option"
                                checked={selectedCompanionId === companion.id}
                                onClick={() => {
                                    onSelect(companion.id)
                                    onClose()
                                }}
                            >
                                <Flex direction="row" align="center" gap={10}>
                                    <Icon size={36} variant={companion.element}>
                                        {companion.icon}
                                    </Icon>
                                    <Flex direction="column" align="start" gap={2}>
                                        <Heading h="3">{companion.name}</Heading>
                                        <Text size="small">{companion.element} · Tier {companion.tier}</Text>
                                    </Flex>
                                </Flex>
                            </Button>
                        </Paper>
                    )) : (
                        <Text size="small">
                            {slotLabel === "Any Element"
                                ? "You haven't discovered any companions yet."
                                : "You haven't discovered a matching or neutral companion yet."}
                        </Text>
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
