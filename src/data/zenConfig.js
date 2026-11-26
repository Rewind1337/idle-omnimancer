export const TIME_ENERGY_CONFIG = {
    capMs: 2 * 60 * 60 * 1000,
    // One hour of qualifying offline idle time creates ten minutes of energy.
    idleGenerationDivisor: 6,
    unlockCosts: [
        { item: "currency:coins", amount: 2500 },
        { item: "item:loose_notes", amount: 100 },
        { item: "item:bound_notes", amount: 100 },
        { item: "item:translated_scrolls", amount: 100 },
    ],
}

export const ZEN_CONFIG = {
    id: "skill:zen",
    unlockedByDefault: false,
    variant: "zen",
    skillXP: { firstLevelXP: 2 },
    time: { base: 360, perTier: 0 },
    actionXP: { base: 5, perTier: 5 },
    // Shop-only costs: keep separate from skill.unlockCosts so generic skill unlocking
    // cannot bypass the Time Energy prerequisite or the dedicated purchase action.
    improvementCosts: [
        { item: "currency:coins", amount: 5000 },
        { item: "item:bound_notes", amount: 250 },
        { item: "item:translated_scrolls", amount: 250 },
        { item: "item:arcane_manuscript", amount: 250 },
    ],
    neededXP: {
        base: 10,
        perTier: 5,
        perLevelMult: 1.12,
        perLevelFlat: 0,
        perTierMult: 1,
        finalMultPerLevel: 1,
    },
    actions: [
        {
            id: "action:grounding_meditation",
            name: "Grounding",
            tier: 1,
            unlockedByDefault: true,
            description: "Settle your thoughts and reconnect with the present moment.",
        },
        {
            id: "action:deep_stillness",
            name: "Deep Stillness",
            tier: 2,
            unlockedByDefault: true,
            description: "Sink into a deeper state of focus and inner stillness.",
        },
    ],
}

export const getZenAction = actionId =>
    ZEN_CONFIG.actions.find(action => action.id === actionId) ?? ZEN_CONFIG.actions[0]
