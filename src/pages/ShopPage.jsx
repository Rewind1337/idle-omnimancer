import { cloneElement } from "react"

import { Flex } from "../components/Flex"
import { Paper } from "../components/Paper"
import { Heading } from "../components/Heading"
import { Icon } from "../components/Icon"
import { Button } from "../components/Button"
import { Item } from "../components/Item"

import { SPELLCRAFT_CONFIG } from "../data/SpellcraftConfig"
import { SKILL_ICONS } from "../data/iconLibrary"
import { ITEM_DATA_BY_ID, CURRENCY_DATA_BY_ID } from "../data/itemData"
import { SKILL_NAVIGATION } from "../data/navigationData"
import { canUnlockSkill } from "../game/gameEngine"
import { humanize } from "../utility/helpers"
import { useGame } from "../hooks/useGame"

export function ShopPage({ setActivePage }) {
    const { player, unlockSkill } = useGame()
    const skillId = SPELLCRAFT_CONFIG.id
    const spellcraftTab = SKILL_NAVIGATION.find(skill => skill.skillId === skillId)
    const isUnlocked = player.unlockedSkills.includes(skillId)
    const canUnlock = canUnlockSkill(player, skillId)

    if (isUnlocked) return null

    const handleUnlock = () => {
        if (!canUnlock || !spellcraftTab) return
        unlockSkill(skillId)
        setActivePage(spellcraftTab.id)
    }

    return (
        <Flex direction="column" padding={32} gap={32}>
            <Paper layer={1} variant="shop" className="action action-shop">
                <Flex direction="column" gap={16}>
                    <Flex direction="row" align="center" gap={16}>
                        <Icon size={48} variant="shop">
                            {cloneElement(SKILL_ICONS.SPELLCRAFT, { size: 48 })}
                        </Icon>
                        <Flex direction="column" gap={8}>
                            <Heading h="2">Unlock {humanize(skillId)}</Heading>
                            <Button
                                variant="shop"
                                size="medium"
                                className="w-100"
                                disabled={!canUnlock}
                                onClick={handleUnlock}
                            >
                                Unlock Spellcraft
                            </Button>
                        </Flex>
                    </Flex>
                    <Flex direction="column" gap={8}>
                        <Heading h="2">Requires:</Heading>
                        <Flex direction="row" wrap>
                            {SPELLCRAFT_CONFIG.unlockCosts.map(({ item, amount }) => {
                                const data = ITEM_DATA_BY_ID[item] ?? CURRENCY_DATA_BY_ID[item]
                                return (
                                    <Item
                                        key={item}
                                        layer={2}
                                        mode="compact"
                                        interactive={false}
                                        icon={data?.icon}
                                        name={data?.name ?? humanize(item)}
                                        amount={amount}
                                        variant={data?.variant ?? "primary"}
                                    />
                                )
                            })}
                        </Flex>
                    </Flex>
                </Flex>
            </Paper>
        </Flex>
    )
}
