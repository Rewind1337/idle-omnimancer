import { Button } from "../Button"
import { Flex } from "../Flex"
import { Heading } from "../Heading"
import { Item } from "../Item"
import { Modal } from "../Modal"
import { Paper } from "../Paper"
import { Progress } from "../Progress"
import { EffectStack } from "../EffectStack"
import { Text } from "../Text"

import { ARTIFACT_DATA } from "../../data/itemData"
import { OTHER_ICONS } from "../../data/iconLibrary"
import { getArtifactCollectionEffectEntries } from "../../game/gameEngine"

import "./ArtifactCollectionModal.scss"

export function ArtifactCollectionModal({ visible, player, onClose }) {
    if (!visible) return null

    const discoveredArtifacts = new Set(player.identifiedArtifacts ?? [])
    const artifactCount = discoveredArtifacts.size
    const artifactProgress = ARTIFACT_DATA.length > 0
        ? artifactCount / ARTIFACT_DATA.length * 100
        : 0
    const activeEffects = getArtifactCollectionEffectEntries(player)

    return (
        <Modal
            visible={visible}
            variant="combat"
            className="modal-artifact-collection"
            onBackdropClick={onClose}
            header={
                <Flex direction="column" gap={6}>
                    <Flex direction="row" justify="space-between" align="center" wrap gap={8}>
                        <Heading h="2">Artifact Collection</Heading>
                        <Text size="small">{artifactCount} / {ARTIFACT_DATA.length} Discovered</Text>
                    </Flex>
                    <Progress
                        className="artifact-collection-header-progress"
                        layer={2}
                        size="xsmall"
                        corners="rounded"
                        variant="combat"
                        percentage={artifactProgress}
                        label=""
                    />
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
                                    iconSize={48}
                                    name={artifact.name}
                                    itemId={artifact.id}
                                    variant={artifact.variant}
                                    interactive={false}
                                />
                            )
                        })}
                    </div>
                    <Paper layer={2} variant="combat" className="artifact-collection-effects">
                        <EffectStack
                            title="Active Artifact Effects"
                            icon={OTHER_ICONS.ARTIFACT}
                            entries={activeEffects}
                            emptyLabel="No artifact effects are active yet."
                        />
                    </Paper>
                </Flex>
            )}
        />
    )
}
