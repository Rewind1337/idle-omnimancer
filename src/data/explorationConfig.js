import { WORLD_DATA } from "./worldData"
import { ITEM_DATA_BY_ID } from "./itemData"

// Exploration areas are individual active actions arranged on a shared axial hex map.
export const EXPLORATION_CONFIG = {
    id: "skill:exploration",
    variant: "exploration",
    unlockRule: "adjacent",

    unlockCosts: [
        { item: "item:earth_catalyst_i", amount: 5 },
        { item: "item:air_catalyst_i", amount: 5 },
        { item: "item:water_catalyst_i", amount: 5 },
        { item: "currency:coins", amount: 10000 },
    ],

    // Base chance to discover the area's companion container, when configured.
    companionChance: {
        base: 0.001,
    },

    // Reserved for Combat; artifacts are not dropped by Exploration.
    artifactChance: {
        base: 0.001,
    },

    skillXP: {
        firstLevelXP: 3,
    },

    time: {
        base: 6,
        perTier: 1,
    },

    actionXP: {
        base: 12,
        perTier: 5,
    },

    neededXP: {
        base: 25,
        perTier: 10,
        perLevelMult: 1.126,
        perLevelFlat: 2,
        perTierMult: 1.001,
        finalMultPerLevel: 0.999,
    },

    milestones: [
        { level: 10, reach: "local", type: "mult", effect: "actionTime", value: 1.1 },
    ],

    actionMilestones: [],

    actions: WORLD_DATA.areas.map(area => {
        const companionContainer = area.exploration.produces.find(itemId =>
            ITEM_DATA_BY_ID[itemId]?.type === "companionContainer"
        ) ?? null
        const artifactItem = area.combat.produces.find(itemId =>
            ITEM_DATA_BY_ID[itemId]?.type === "artifact"
        ) ?? null

        return {
            id: area.actionId,
            areaId: area.id,
            name: area.name,
            position: area.position,
            tier: area.tier,
            element: area.element,
            produces: area.exploration.produces.filter(itemId =>
                ITEM_DATA_BY_ID[itemId]?.type !== "companionContainer"
            ),
            companionContainer,
            artifactItem,
            combatProduces: area.combat.produces,
            unlockCosts: area.exploration.unlockCosts ?? [],
            unlockedByDefault: Boolean(area.unlockedByDefault),
        }
    }),
}
