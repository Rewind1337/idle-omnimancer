import { Flex } from "../Flex"
import { Progress } from "../Progress"
import { Heading } from "../Heading"
import { Badge } from "../Badge"
import { EffectStack } from "../EffectStack"

import {
    getManaCapacity,
    getManaRegeneration,
    getManaEffectStacks,
} from "../../game/gameEngine"
import { useGame } from "../../hooks/useGame"
import { OTHER_ICONS } from "../../data/iconLibrary"

export function ManaBar() {
    const { player } = useGame()
    const maxMana = getManaCapacity(player)
    const currentMana = Math.min(
        maxMana,
        Math.max(0, Number(player.mana?.current) || 0)
    )
    const percentage = maxMana > 0 ? (currentMana / maxMana) * 100 : 0
    const regeneration = getManaRegeneration(player)
    const manaEffects = getManaEffectStacks(player)

    return (
        <Flex direction="column" gap={8}>
            <Flex justify="center" align="center">
                <Heading h="2" className="w-100 align-center" weight={700}>Mana Status</Heading>
            </Flex>
            <Progress size="medium" variant="mana" corners="rounded" label={currentMana.toFixed(0)} percentage={percentage} />
            <Flex justify="center">
                <Badge
                    variant="mana"
                    interactive
                    icon={OTHER_ICONS.ZAP}
                    tooltip={
                        <Flex direction="column" gap={8}>
                            <Heading h="4" className="w-100 align-center">Maximum Mana capacity.</Heading>
                            <hr />
                            <EffectStack
                                title="Mana capacity effects"
                                icon={OTHER_ICONS.ZAP}
                                entries={manaEffects.manaCapacity}
                                formulas={[
                                    "Capacity = (base Mana + Spellcraft level bonuses) × max(0, 1 + Σ multiplier bonuses) + Σ flat bonuses",
                                ]}
                            />
                        </Flex>
                    }
                >
                    {maxMana} Mana Capacity
                </Badge>
                <Badge
                    variant="mana"
                    interactive
                    icon={OTHER_ICONS.ZAP}
                    tooltip={
                        <Flex direction="column" gap={8}>
                            <Heading h="4" className="w-100 align-center">Mana regenerated each second.</Heading>
                            <hr />
                            <EffectStack
                                title="Mana regeneration effects"
                                icon={OTHER_ICONS.ZAP}
                                entries={manaEffects.manaRegeneration}
                                formulas={[
                                    "Regeneration = (base regeneration + Spellcraft level bonuses) × max(0, 1 + Σ multiplier bonuses) + Σ flat bonuses",
                                ]}
                            />
                        </Flex>
                    }
                >
                    +{regeneration.toFixed(1)} Mana / second
                </Badge>
            </Flex>
        </Flex>
    )
}
