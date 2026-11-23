import { cloneElement } from "react"

import { ActionResources } from "../actions/ActionResources"
import { Badge } from "../Badge"
import { Button } from "../Button"
import { Flex } from "../Flex"
import { Heading } from "../Heading"
import { Icon } from "../Icon"
import { Modal } from "../Modal"
import { Paper } from "../Paper"
import { Text } from "../Text"

import { COMBAT_CONFIG } from "../../data/combatConfig"
import { OTHER_ICONS, SPELLCRAFT_ACTION_ICONS } from "../../data/iconLibrary"
import { SPELLCRAFT_CONFIG } from "../../data/spellcraftConfig"
import { getActionUnlockCosts } from "../../game/gameEngine"
import { humanize } from "../../utility/helpers"

export function SpellSelectionModal({
    visible,
    slotIndex,
    player,
    selectedAttackId = null,
    unavailableAttackIds = [],
    onSelect,
    onClose,
}) {
    if (!visible) return null

    const spellcraftUnlocked = player.unlockedSkills?.includes(SPELLCRAFT_CONFIG.id) ?? false
    const unavailable = new Set(unavailableAttackIds)

    const renderOption = ({ id, name, element, tier, icon, unlocked, level, unlockCosts = [] }) => {
        const isSelected = selectedAttackId === id
        const isUsedElsewhere = unavailable.has(id)
        const canSelect = unlocked && !isUsedElsewhere

        return (
            <Paper
                key={id}
                variant={element}
                interactive={canSelect}
                selected={isSelected}
                layer={2}
                className="w-100 spell-selection-option"
                onClick={() => {
                    if (canSelect) onSelect(id)
                }}
            >
                <Flex direction="row" align="center" gap={10}>
                    <Paper round layer="0" padding={4} className="w-min">
                        <Icon size={56} variant={element} interactive={false} outerShape={7} innerShape={5}>
                            {cloneElement(icon, { size: 40 })}
                        </Icon>
                    </Paper>
                    <Flex direction="column" align="start" gap={6} className="flex-grow">
                        <Heading h="3">{name}</Heading>
                        <Flex direction="row" align="center" wrap gap={6}>
                            <Badge size="small" variant="transparent">{humanize(element)} · Tier {tier}</Badge>
                            {unlocked && <Badge size="small" variant="transparent">Level {level}</Badge>}
                            {isSelected && <Badge size="small" variant="combat">Selected</Badge>}
                            {isUsedElsewhere && <Badge size="small" variant="transparent">Used in another slot</Badge>}
                            {!unlocked && <Badge size="small" variant="transparent">Locked</Badge>}
                        </Flex>
                        {!unlocked && (
                            unlockCosts.length > 0
                                ? <ActionResources requires={unlockCosts} />
                                : <Text size="small">Unlock this action in Spellcraft before adding it to Combat.</Text>
                        )}
                    </Flex>
                </Flex>
            </Paper>
        )
    }

    const omnibolt = {
        id: "omnibolt",
        name: "Omnibolt",
        element: "neutral",
        tier: COMBAT_CONFIG.player.omniboltTier,
        icon: OTHER_ICONS.ZAP,
        unlocked: true,
        level: player.skills?.[SPELLCRAFT_CONFIG.id]?.level ?? 1,
    }

    return (
        <Modal
            visible={visible}
            variant="combat"
            className="modal-spell-selection"
            onBackdropClick={onClose}
            header={<Heading h="2">Choose for Rotation Slot {slotIndex + 1}</Heading>}
            footer={<Button variant="combat" className="w-100" onClick={onClose}>Close</Button>}
            content={
                <Flex direction="column" gap={10}>
                    {renderOption(omnibolt)}
                    {SPELLCRAFT_CONFIG.actions.map(spell => {
                        const state = player.skills?.[SPELLCRAFT_CONFIG.id]?.actions?.[spell.id]
                        const unlocked = spellcraftUnlocked && Boolean(state?.unlocked)
                        const icon = SPELLCRAFT_ACTION_ICONS[spell.element?.toUpperCase()]?.[spell.tier - 1] ?? OTHER_ICONS.ZAP

                        return renderOption({
                            id: spell.id,
                            name: spell.name ?? humanize(spell.id.replace(/^action:/, "")),
                            element: spell.element ?? "neutral",
                            tier: spell.tier,
                            icon,
                            unlocked,
                            level: state?.level ?? 1,
                            unlockCosts: unlocked
                                ? []
                                : getActionUnlockCosts(player, SPELLCRAFT_CONFIG.id, spell.id),
                        })
                    })}
                </Flex>
            }
        />
    )
}
