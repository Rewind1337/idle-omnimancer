import { cloneElement, useState } from "react"

import { Flex } from "../components/Flex"
import { Paper } from "../components/Paper"
import { Heading } from "../components/Heading"
import { Icon } from "../components/Icon"
import { Button } from "../components/Button"
import { Text } from "../components/Text"
import { Badge } from "../components/Badge"
import { Tabs } from "../components/Tabs"
import { ActionResources } from "../components/actions/ActionResources"

import { OTHER_ICONS, SHOP_ICONS } from "../data/iconLibrary"
import { SHOP_ITEM_DATA } from "../data/itemData"
import {
    RESEARCH_BREAKTHROUGH_CONFIG,
    getResearchBreakthroughCost,
} from "../data/researchBreakthroughConfig"
import { SKILL_NAVIGATION } from "../data/navigationData"
import { TIME_ENERGY_CONFIG, ZEN_CONFIG } from "../data/zenConfig"
import { GLOBAL_CONFIG, SKILL_CONFIG_BY_ID } from "../data/skillConfig"
import {
    canUnlockAction,
    canUnlockSkill,
    canBuyShopItem,
    getNextBagSlotCost,
    getVisibleActions,
    getActionUnlockCosts,
    getSkillUnlockCosts,
    canBuyTimeEnergy,
    canBuyZen,
} from "../game/gameEngine"
import { humanize } from "../utility/helpers"
import { useGame } from "../hooks/useGame"

const SHOP_TABS = [
    { id: "improvements", name: "Improvements", icon: SHOP_ICONS.IMPROVEMENTS },
    { id: "skills-actions", name: "Skills & Actions", icon: SHOP_ICONS.SKILLS_ACTIONS },
    { id: "general-goods", name: "General Goods", icon: SHOP_ICONS.GENERAL_GOODS },
    { id: "fame-shop", name: "Fame Shop", icon: OTHER_ICONS.STAR, variant: "secondary" },
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

function TimeEnergyImprovement({ player, buyTimeEnergy }) {
    const unlocked = player.timeEnergy?.unlocked === true
    return (
        <Paper layer={2} variant="zen" className="action action-shop">
            <Flex direction="column" gap={12}>
                <Flex direction="row" align="center" gap={16}>
                    <Icon size={44} variant="zen">
                        {cloneElement(OTHER_ICONS.HOURGLASS, { size: 40 })}
                    </Icon>
                    <Flex direction="column" gap={8}>
                        <Heading h="3">Time Energy</Heading>
                        <Text size="small">Store up to two hours of energy. Before Zen, it is generated while offline and idle; Zen meditation also restores energy. Spend it online to simulate eligible gameplay at 2× speed.</Text>
                        <Button variant="zen" size="medium" className="w-100" disabled={unlocked || !canBuyTimeEnergy(player)} onClick={buyTimeEnergy}>
                            {unlocked ? "Unlocked" : "Unlock Time Energy"}
                        </Button>
                    </Flex>
                </Flex>
                {!unlocked && <ActionResources requires={TIME_ENERGY_CONFIG.unlockCosts} />}
            </Flex>
        </Paper>
    )
}

function ZenImprovement({ player, buyZen }) {
    const unlocked = player.zen?.unlocked === true
    const prerequisiteMet = player.timeEnergy?.unlocked === true
    return (
        <Paper layer={2} variant="zen" className="action action-shop">
            <Flex direction="column" gap={12}>
                <Flex direction="row" align="center" gap={16}>
                    <Icon size={44} variant="zen">
                        {cloneElement(OTHER_ICONS.MEDITATE, { size: 40 })}
                    </Icon>
                    <Flex direction="column" gap={8}>
                        <Heading h="3">Zen</Heading>
                        <Text size="small">Unlock meditation. When no other active action is running, you automatically meditate and earn Zen XP and Time Energy.</Text>
                        {!prerequisiteMet && <Badge variant="transparent" icon={OTHER_ICONS.INFO}>Requires Time Energy</Badge>}
                        <Button variant="zen" size="medium" className="w-100" disabled={unlocked || !canBuyZen(player)} onClick={buyZen}>
                            {unlocked ? "Unlocked" : "Unlock Zen"}
                        </Button>
                    </Flex>
                </Flex>
                {!unlocked && <ActionResources requires={ZEN_CONFIG.unlockCosts} />}
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
                        {formatCoins(nextSlotCost)} Coins
                    </Button>
                </Flex>
            </Flex>
        </Paper>
    )
}

function ResearchBreakthroughImprovement({ player, buyResearchBreakthrough }) {
    const currentTier = Math.max(
        0,
        Math.min(
            RESEARCH_BREAKTHROUGH_CONFIG.maxTier,
            Math.floor(Number(player.researchBreakthroughTier) || 0)
        )
    )
    const nextCost = getResearchBreakthroughCost(currentTier)
    const coins = player.currencies?.coins ?? 0
    const isMaxTier = currentTier >= RESEARCH_BREAKTHROUGH_CONFIG.maxTier
    const canPurchase = !isMaxTier && coins >= nextCost

    return (
        <Paper layer={2} variant="shop" className="action action-shop">
            <Flex direction="column" gap={12}>
                <Flex direction="row" align="center" gap={16}>
                    <Icon size={44} variant="shop">
                        {cloneElement(OTHER_ICONS.FLAME, { size: 40 })}
                    </Icon>
                    <Flex direction="column" gap={8}>
                        <Heading h="3">Research Breakthrough</Heading>
                        <Text size="small">
                            Current Tier: {currentTier} / {RESEARCH_BREAKTHROUGH_CONFIG.maxTier}
                        </Text>
                        <Button
                            variant="shop"
                            size="medium"
                            className="w-100"
                            disabled={!canPurchase}
                            onClick={buyResearchBreakthrough}
                        >
                            {isMaxTier
                                ? "All Tiers Unlocked"
                                : formatCoins(nextCost) + " Coins"}
                        </Button>
                    </Flex>
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
    const skills = []
    const actions = []

    for (const skillTab of SKILL_NAVIGATION) {
        const skill = SKILL_CONFIG_BY_ID[skillTab.skillId]
        if (!skill) continue

        const isUnlocked = player.unlockedSkills?.includes(skill.id)

        if (!isUnlocked) {
            if (!Array.isArray(skill.unlockCosts) || skill.unlockCosts.length === 0) continue

            skills.push({
                key: "skill-" + skill.id,
                title: "Unlock " + skillTab.name,
                subtitle: "Skill",
                icon: skillTab.icon,
                variant: skillTab.variant,
                requirements: getSkillUnlockCosts(player, skill.id),
                buttonLabel: "Unlock Skill",
                canUnlock: canUnlockSkill(player, skill.id),
                onUnlock: () => unlockSkill(skill.id),
            })
            continue
        }

        const nextAction = getVisibleActions(player, skill.id).find(action =>
            !player.skills?.[skill.id]?.actions?.[action.id]?.unlocked
        )
        if (!nextAction) continue

        actions.push({
            key: "action-" + skill.id + "-" + nextAction.id,
            title: nextAction.name ?? humanize(nextAction.id.replace(/^action:/, "")),
            subtitle: skillTab.name + " Action · Tier " + nextAction.tier,
            icon: skillTab.icon,
            variant: skillTab.variant,
            requirements: getActionUnlockCosts(player, skill.id, nextAction.id),
            buttonLabel: "Unlock Action",
            canUnlock: canUnlockAction(player, skill.id, nextAction.id),
            onUnlock: () => unlockAction(skill.id, nextAction.id),
        })
    }

    return { skills, actions }
}

export function ShopPage({ onOpenFameShop }) {
    const { player, unlockSkill, unlockAction, buyBagSlot, buyResearchBreakthrough, buyTimeEnergy, buyZen, buyShopItem } = useGame()
    const [activeTab, setActiveTab] = useState("improvements")
    const { skills: availableSkills, actions: availableActions } = getAvailableUnlocks(player, unlockSkill, unlockAction)
    const handleTabChange = tabId => {
        if (tabId === "fame-shop") {
            onOpenFameShop?.()
            return
        }
        setActiveTab(tabId)
    }

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
                            onChange={handleTabChange}
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
                        <Flex direction="column" gap={12}>
                            <ResearchBreakthroughImprovement
                                player={player}
                                buyResearchBreakthrough={buyResearchBreakthrough}
                            />
                            <TimeEnergyImprovement player={player} buyTimeEnergy={buyTimeEnergy} />
                            <ZenImprovement player={player} buyZen={buyZen} />
                            <BagSlotImprovement player={player} buyBagSlot={buyBagSlot} />
                        </Flex>
                    </ShopSection>
                )}

                {activeTab === "skills-actions" && (
                    <ShopSection title="Skills & Actions">
                        <Flex direction="column" gap={20}>
                            <Flex direction="column" gap={12}>
                                <Heading h="3">Skills</Heading>
                                {availableSkills.length > 0 ? (
                                    <Flex direction="column" gap={12}>
                                        {availableSkills.map(unlock => (
                                            <ShopUnlockCard key={unlock.key} {...unlock} />
                                        ))}
                                    </Flex>
                                ) : (
                                    <Text>No skills are currently available to unlock.</Text>
                                )}
                            </Flex>
                            <Flex direction="column" gap={12}>
                                <Heading h="3">Actions</Heading>
                                {availableActions.length > 0 ? (
                                    <Flex direction="column" gap={12}>
                                        {availableActions.map(unlock => (
                                            <ShopUnlockCard key={unlock.key} {...unlock} />
                                        ))}
                                    </Flex>
                                ) : (
                                    <Text>No actions are currently available to unlock.</Text>
                                )}
                            </Flex>
                        </Flex>
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
