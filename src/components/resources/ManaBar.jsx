import { Flex } from "../Flex"
import { Progress } from "../Progress"

import { getManaCapacity, getManaRegeneration } from "../../game/gameEngine"
import { useGame } from "../../hooks/useGame"

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
            <Flex justify="space-between">
                <h3>Mana</h3>
                <span>{currentMana.toFixed(1)} / {maxMana.toFixed(0)}</span>
            </Flex>
            <Progress size="medium" variant="mana" percentage={percentage} />
            <Flex justify="flex-end">
                <span>Regenerates {regeneration} Mana per second</span>
            </Flex>
        </Flex>
    )
}
