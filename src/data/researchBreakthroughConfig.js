// Shop-purchased Research upgrade and its tier-gated bonus discoveries.
export const RESEARCH_BREAKTHROUGH_CONFIG = {
    id: "research-breakthrough",
    skillId: "skill:research",
    maxTier: 5,
    baseCost: 10000,
    costMultiplier: 10,
    items: [
        {
            tier: 1,
            itemId: "item:ember_of_insight",
            name: "Spark",
            chance: 0.01,
            baseValue: 100,
        },
        {
            tier: 2,
            itemId: "item:kindled_research_sigil",
            name: "Ember",
            chance: 0.005,
            baseValue: 200,
        },
        {
            tier: 3,
            itemId: "item:pyreforged_codex",
            name: "Flame",
            chance: 0.0025,
            baseValue: 300,
        },
        {
            tier: 4,
            itemId: "item:phoenix_chronicle",
            name: "Blaze",
            chance: 0.00125,
            baseValue: 500,
        },
        {
            tier: 5,
            itemId: "item:primordial_flame_testament",
            name: "Inferno",
            chance: 0.000625,
            baseValue: 900,
        },
    ],
}

// The first purchase costs 10,000 Coins; each later tier costs ten times more.
export const getResearchBreakthroughCost = (currentTier = 0) => {
    const tier = Math.max(0, Math.floor(Number(currentTier) || 0))
    if (tier >= RESEARCH_BREAKTHROUGH_CONFIG.maxTier) return Infinity

    const cost = RESEARCH_BREAKTHROUGH_CONFIG.baseCost *
        Math.pow(RESEARCH_BREAKTHROUGH_CONFIG.costMultiplier, tier)

    return Number.isFinite(cost) ? Math.ceil(cost) : Infinity
}

// A discovery is only possible when both its shop tier and Research action tier
// have reached the discovery's tier. Higher Research actions retain lower-tier rolls.
export const getResearchBreakthroughItems = (unlockedTier = 0, actionTier = 0) => {
    const purchasedTier = Math.max(
        0,
        Math.min(RESEARCH_BREAKTHROUGH_CONFIG.maxTier, Math.floor(Number(unlockedTier) || 0))
    )
    const researchTier = Math.max(0, Math.floor(Number(actionTier) || 0))

    return RESEARCH_BREAKTHROUGH_CONFIG.items.filter(item =>
        item.tier <= purchasedTier && item.tier <= researchTier
    )
}

export const formatResearchBreakthroughChance = chance =>
    Number((chance * 100).toFixed(4)) + "% chance"
