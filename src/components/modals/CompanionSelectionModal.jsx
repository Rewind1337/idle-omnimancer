import { cloneElement } from "react"

import { Badge } from "../Badge"
import { Button } from "../Button"
import { CompanionEffectBadge } from "../CompanionEffectBadge"
import { Flex } from "../Flex"
import { Heading } from "../Heading"
import { Icon } from "../Icon"
import { Modal } from "../Modal"
import { Paper } from "../Paper"
import { Text } from "../Text"

import { COMPANION_CONFIG } from "../../data/companionConfig"
import { OTHER_ICONS } from "../../data/iconLibrary"
import { getCompanionLevelProgress } from "../../game/gameEngine"

const InnerShapeMap = ["dot", 3, 4, 5, 6, 7, 8, 9, 10, "star"]

export function CompanionSelectionModal({
    slotId,
    slotLabel = "Any Element",
    variant = "companions",
    companions = [],
    player,
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
            footer={<Button variant={variant} className="w-100" onClick={onClose}>Close</Button>}
            content={
                <Flex direction="column" gap={10}>
                    {companions.length > 0 ? (
                        companions.map(companion => {
                            const progress = getCompanionLevelProgress(player, companion.id)

                            return (
                                <Paper
                                    key={companion.id}
                                    variant={companion.element}
                                    interactive
                                    layer={2}
                                    className="w-100 companion-selection-option"
                                    checked={selectedCompanionId === companion.id}
                                    onClick={() => {
                                        onSelect(companion.id)
                                        onClose()
                                    }}
                                >
                                    <Flex direction="row" align="center" justify="start" gap={10}>
                                        <Paper round layer="0" className="w-min" padding={4}>
                                            <Icon
                                                size={64}
                                                interactive={false}
                                                outerShape={7}
                                                innerShape={InnerShapeMap[companion.tier - 1]}
                                                variant={companion.element}
                                            >
                                                {cloneElement(companion.icon, { size: 48 })}
                                            </Icon>
                                        </Paper>
                                        <Flex direction="row" justify="center" align="center" gap={8}>
                                            <Heading h="2" className="align-center">{companion.name}</Heading>
                                            <Flex direction="row" align="center" justify="start" wrap gap={6}>
                                                <CompanionEffectBadge
                                                    showScopeLabel={false}
                                                    size="medium"
                                                    companion={companion}
                                                    player={player}
                                                    effectKey="permanentEffect"
                                                    variant={companion.element}
                                                />
                                                <CompanionEffectBadge
                                                    showScopeLabel={false}
                                                    size="medium"
                                                    companion={companion}
                                                    player={player}
                                                    effectKey="activeEffect"
                                                    variant={companion.element}
                                                />
                                            </Flex>
                                            <Flex direction="row" align="center" justify="end" wrap gap={6}>
                                                <Badge
                                                    icon={OTHER_ICONS.STAR}
                                                    interactive
                                                    variant={companion.element}
                                                    tooltip="Companion level increases the strength of both of this companion's effects."
                                                >
                                                    Lv. {progress.level} / {COMPANION_CONFIG.companionLeveling.maxLevel}
                                                </Badge>
                                                <Badge
                                                    icon={OTHER_ICONS.MERGE}
                                                    interactive
                                                    variant={companion.element}
                                                    tooltip="Companion tier determines the base XP required for each level."
                                                >
                                                    Tier {companion.tier}
                                                </Badge>
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                </Paper>
                            )
                        })
                    ) : (
                        <Text size="small">
                            {slotLabel === "Any Element"
                                ? "You haven't discovered any companions yet."
                                : "You haven't discovered a matching or neutral companion yet."}
                        </Text>
                    )}
                    {selectedCompanionId && (
                        <Button
                            transparent
                            className="w-100"
                            size="large"
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
