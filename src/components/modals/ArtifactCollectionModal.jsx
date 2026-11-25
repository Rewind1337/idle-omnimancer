import { Button } from "../Button"
import { Flex } from "../Flex"
import { Heading } from "../Heading"
import { Item } from "../Item"
import { Modal } from "../Modal"
import { Text } from "../Text"

import { ARTIFACT_DATA } from "../../data/itemData"

import "./ArtifactCollectionModal.scss"

export function ArtifactCollectionModal({ visible, player, onClose }) {
    if (!visible) return null

    const discoveredArtifacts = new Set(player.identifiedArtifacts ?? [])

    return (
        <Modal
            visible={visible}
            variant="combat"
            className="modal-artifact-collection"
            onBackdropClick={onClose}
            header={
                <Flex direction="row" justify="space-between" align="center" wrap gap={8}>
                    <Heading h="2">Artifact Collection</Heading>
                    <Text size="small">
                        {discoveredArtifacts.size} / {ARTIFACT_DATA.length} Discovered
                    </Text>
                </Flex>
            }
            footer={(
                <Button variant="combat" className="w-100" onClick={onClose}>
                    Close
                </Button>
            )}
            content={(
                <Flex direction="column" gap={12}>
                    <Text size="small">
                        Discover artifacts through Unveiling to add them to your collection.
                    </Text>
                    <div className="artifact-collection-grid">
                        {ARTIFACT_DATA.map(artifact => {
                            const discovered = discoveredArtifacts.has(artifact.id)
                            return (
                                <Item
                                    key={artifact.id}
                                    layer={3}
                                    className={
                                        discovered
                                            ? "artifact-collection-item"
                                            : "artifact-collection-item artifact-collection-item-locked"
                                    }
                                    icon={artifact.icon}
                                    name={artifact.name}
                                    itemId={artifact.id}
                                    variant={artifact.variant}
                                    interactive={false}
                                />
                            )
                        })}
                    </div>
                </Flex>
            )}
        />
    )
}
