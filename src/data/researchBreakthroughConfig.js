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
            name: "Ember of Insight",
            chance: 0.01,
            baseValue: 1000,
        },
        {
            tier: 2,
            itemId: "item:kindled_research_sigil",
            name: "Kindled Research Sigil",
            chance: 0.005,
            baseValue: 2000,
        },
        {
            tier: 3,
            itemId: "item:pyreforged_codex",
            name: "Pyreforged Codex",
            chance: 0.0025,
            baseValue: 3000,
        },
        {
            tier: 4,
            itemId: "item:phoenix_chronicle",
            name: "Phoenix Chronicle",
            chance: 0.00125,
            baseValue: 5000,
        },
        {
            tier: 5,
            itemId: "item:primordial_flame_testament",
            name: "Primordial Flame Testament",
            chance: 0.000625,
            baseValue: 9000,
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
