import { cloneElement, useState } from "react"

import { Flex } from "../components/Flex"
import { Paper } from "../components/Paper"
import { Heading } from "../components/Heading"
import { Icon } from "../components/Icon"
import { Button } from "../components/Button"
import { Text } from "../components/Text"
import { Tabs } from "../components/Tabs"
import { ActionResources } from "../components/actions/ActionResources"

import { OTHER_ICONS, SHOP_ICONS } from "../data/iconLibrary"
import { SHOP_ITEM_DATA } from "../data/itemData"
import { SKILL_NAVIGATION } from "../data/navigationData"
import { GLOBAL_CONFIG, SKILL_CONFIG_BY_ID } from "../data/skillConfig"
import {
    canUnlockAction,
    canUnlockSkill,
    canBuyShopItem,
    getNextBagSlotCost,
    getVisibleActions,
} from "../game/gameEngine"
import { humanize } from "../utility/helpers"
import { useGame } from "../hooks/useGame"

const SHOP_TABS = [
    { id: "improvements", name: "Improvements", icon: SHOP_ICONS.IMPROVEMENTS },
    { id: "skills-actions", name: "Skills & Actions", icon: SHOP_ICONS.SKILLS_ACTIONS },
    { id: "general-goods", name: "General Goods", icon: SHOP_ICONS.GENERAL_GOODS },
]

const formatCoins = value =>
    Number.isFinite(value) ? value.toLocaleString() : "Unavailable"

function ShopSection({ title, children }) {
    return (
        <Paper layer={1}>
            <Flex direction="column" gap={16}>
                <Heading h="2">{title}</Heading>
                {children}
            </Flex>
        </Paper>
    )
}

function ShopUnlockCard({
    title,
    subtitle,
    icon,
    variant,
    requirements = [],
    buttonLabel,
    canUnlock,
    onUnlock,
}) {
    return (
        <Paper layer={2} variant={variant} className="action action-shop">
            <Flex direction="column" gap={12}>
                <Flex direction="row" align="center" gap={16}>
                    <Icon size={44} variant={variant}>
                        {cloneElement(icon ?? OTHER_ICONS.STAR, { size: 40 })}
                    </Icon>
                    <Flex direction="column" gap={8}>
                        <Heading h="3">{title}</Heading>
                        <Text size="small">{subtitle}</Text>
                        <Button
                            variant="shop"
                            size="medium"
                            className="w-100"
                            disabled={!canUnlock}
                            onClick={onUnlock}
                        >
                            {buttonLabel}
                        </Button>
                    </Flex>
                </Flex>
                {requirements.length > 0 && (
                    <ActionResources requires={requirements} />
                )}
            </Flex>
        </Paper>
    )
}

function BagSlotImprovement({ player, buyBagSlot }) {
    const inventorySlots = player.inventorySlots ?? GLOBAL_CONFIG.startingBagSpace
    const nextSlotCost = getNextBagSlotCost(inventorySlots)
    const coins = player.currencies?.coins ?? 0
    const canPurchase = Number.isFinite(nextSlotCost) && coins >= nextSlotCost

    return (
        <Paper layer={2} variant="shop" className="action action-shop">
            <Flex direction="row" align="center" gap={16}>
                <Icon size={44} variant="shop">
                    {cloneElement(OTHER_ICONS.GRIP, { size: 40 })}
                </Icon>
                <Flex direction="column" gap={8}>
                    <Heading h="3">Additional Bag Slot</Heading>
                    <Text size="small">Current capacity: {inventorySlots} slots</Text>
                    <Button
                        variant="shop"
                        size="medium"
                        className="w-100"
                        disabled={!canPurchase}
                        onClick={buyBagSlot}
                    >
                        Buy for {formatCoins(nextSlotCost)} Coins
                    </Button>
                </Flex>
            </Flex>
        </Paper>
    )
}

function ShopGoodCard({ item, player, buyShopItem }) {
    const amountHeld = player.inventory?.[item.id] ?? 0
    const canPurchase = canBuyShopItem(player, item.id)

    return (
        <Paper layer={2} variant="shop" className="action action-shop">
            <Flex direction="row" align="center" gap={16}>
                <Icon size={44} variant={item.variant ?? "shop"}>
                    {cloneElement(item.icon ?? OTHER_ICONS.STAR, { size: 40 })}
                </Icon>
                <Flex direction="column" gap={8}>
                    <Heading h="3">{item.name}</Heading>
                    {item.description && <Text size="small">{item.description}</Text>}
                    {amountHeld > 0 && <Text size="small">Owned: {amountHeld.toLocaleString()}</Text>}
                    <Button
                        variant="shop"
                        size="medium"
                        className="w-100"
                        disabled={!canPurchase}
                        onClick={() => buyShopItem(item.id)}
                    >
                        Buy for {formatCoins(item.shopPrice)} Coins
                    </Button>
                </Flex>
            </Flex>
        </Paper>
    )
}

function getAvailableUnlocks(player, unlockSkill, unlockAction) {
    return SKILL_NAVIGATION.flatMap(skillTab => {
        const skill = SKILL_CONFIG_BY_ID[skillTab.skillId]
        if (!skill) return []

        const isUnlocked = player.unlockedSkills?.includes(skill.id)

        if (!isUnlocked) {
            if (!Array.isArray(skill.unlockCosts) || skill.unlockCosts.length === 0) return []

            return [{
                key: "skill-" + skill.id,
                title: "Unlock " + skillTab.name,
                subtitle: "Skill",
                icon: skillTab.icon,
                variant: skillTab.variant,
                requirements: skill.unlockCosts,
                buttonLabel: "Unlock Skill",
                canUnlock: canUnlockSkill(player, skill.id),
                onUnlock: () => unlockSkill(skill.id),
            }]
        }

        const nextAction = getVisibleActions(player, skill.id).find(action =>
            !player.skills?.[skill.id]?.actions?.[action.id]?.unlocked
        )
        if (!nextAction) return []

        return [{
            key: "action-" + skill.id + "-" + nextAction.id,
            title: humanize(nextAction.id.replace(/^action:/, "")),
            subtitle: skillTab.name + " Action · Tier " + nextAction.tier,
            icon: skillTab.icon,
            variant: skillTab.variant,
            requirements: nextAction.unlockCosts ?? [],
            buttonLabel: "Unlock Action",
            canUnlock: canUnlockAction(player, skill.id, nextAction.id),
            onUnlock: () => unlockAction(skill.id, nextAction.id),
        }]
    })
}

export function ShopPage() {
    const { player, unlockSkill, unlockAction, buyBagSlot, buyShopItem } = useGame()
    const [activeTab, setActiveTab] = useState("improvements")
    const availableUnlocks = getAvailableUnlocks(player, unlockSkill, unlockAction)

    return (
        <Flex
            direction="column"
            className="page-flex page-flex-shop"
            padding={32}
            gap={16}
        >
            <Paper layer={0}>
                <Paper layer={1}>
                    <Flex direction="column" gap={16}>
                        <Heading h="1">Shop</Heading>
                        <Tabs
                            tabs={SHOP_TABS}
                            value={activeTab}
                            onChange={setActiveTab}
                            variant="shop"
                            size="medium"
                            wrap
                            className="shop-tabs"
                        />
                    </Flex>
                </Paper>
            </Paper>

            <Paper layer={0}>
                {activeTab === "improvements" && (
                    <ShopSection title="Improvements">
                        <BagSlotImprovement player={player} buyBagSlot={buyBagSlot} />
                    </ShopSection>
                )}

                {activeTab === "skills-actions" && (
                    <ShopSection title="Skills & Actions">
                        {availableUnlocks.length > 0 ? (
                            <Flex direction="column" gap={12}>
                                {availableUnlocks.map(unlock => (
                                    <ShopUnlockCard key={unlock.key} {...unlock} />
                                ))}
                            </Flex>
                        ) : (
                            <Text>No skills or actions are currently available to unlock.</Text>
                        )}
                    </ShopSection>
                )}

                {activeTab === "general-goods" && (
                    <ShopSection title="General Goods">
                        {SHOP_ITEM_DATA.length > 0 ? (
                            <Flex direction="column" gap={12}>
                                {SHOP_ITEM_DATA.map(item => (
                                    <ShopGoodCard
                                        key={item.id}
                                        item={item}
                                        player={player}
                                        buyShopItem={buyShopItem}
                                    />
                                ))}
                            </Flex>
                        ) : (
                            <Text>No items are currently available for purchase.</Text>
                        )}
                    </ShopSection>
                )}
            </Paper>
        </Flex>
    )
}
