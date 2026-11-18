import { Flex } from "../Flex"
import { Progress } from "../Progress"

import { getManaCapacity, getManaRegeneration } from "../../game/gameEngine"
import { useGame } from "../../hooks/useGame"
import { Heading } from "../Heading"
import { Badge } from "../Badge"
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

    return (
        <Flex direction="column" gap={8}>
            <Flex justify="center" align="center">
                <Heading h="2" className="w-100 align-center" weight={700}>Mana Status</Heading>
            </Flex>
            <Progress size="medium" variant="mana" corners="rounded" label={currentMana.toFixed(0)} percentage={percentage} />
            <Flex justify="center">
                <Badge variant="mana" interactive icon={OTHER_ICONS.ZAP} >{maxMana} Mana Capacity</Badge>
                <Badge variant="mana" interactive icon={OTHER_ICONS.ZAP} >+{regeneration.toFixed(1)} Mana / second</Badge>
            </Flex>
        </Flex>
    )
}
