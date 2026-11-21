// Number of completed missions in the current tier required to unlock the next tier.
// Tier 1 starts at five completions, then each new tier requires one additional completion.
// The final entry unlocks Mission Tier 10.
export const MISSION_TIER_REQUIREMENTS = [5, 6, 7, 8, 9, 10, 11, 12, 13]

export const MISSION_DATA = {
    startingTier: 1,
    tierRequirements: MISSION_TIER_REQUIREMENTS,

    /* Tier 1 Missions */
    missions: [
        {
            id: "mission:research_loose_notes",
            tier: 1,
            title: "A Scholar's First Steps",
            description: "Turn in 100 Loose Notes.",
            objective: {
                type: "turnIn",
                item: "item:loose_notes",
                amount: 100,
            },
            rewards: [{ currency: "currency:fame", amount: 1 }],
        },
        {
            id: "mission:earth_dust",
            tier: 1,
            title: "A Grain of Earth",
            description: "Turn in 100 Dust.",
            objective: {
                type: "turnIn",
                item: "item:dust",
                amount: 100,
            },
            rewards: [{ currency: "currency:fame", amount: 1 }],
        },
        {
            id: "mission:water_droplets",
            tier: 1,
            title: "A Drop of Potential",
            description: "Turn in 100 Droplets.",
            objective: {
                type: "turnIn",
                item: "item:droplet",
                amount: 100,
            },
            rewards: [{ currency: "currency:fame", amount: 1 }],
        },
        {
            id: "mission:air_breath",
            tier: 1,
            title: "A Breath of Fresh Air",
            description: "Turn in 100 Breath.",
            objective: {
                type: "turnIn",
                item: "item:breath",
                amount: 100,
            },
            rewards: [{ currency: "currency:fame", amount: 1 }],
        },
        {
            id: "mission:earth_lesser_catalyst",
            tier: 1,
            title: "The First Earth Catalysts",
            description: "Turn in 25 Lesser Earth Catalysts.",
            objective: {
                type: "turnIn",
                item: "item:earth_catalyst_i",
                amount: 25,
            },
            rewards: [{ currency: "currency:fame", amount: 1 }],
        },
        {
            id: "mission:air_lesser_catalyst",
            tier: 1,
            title: "The First Air Catalysts",
            description: "Turn in 25 Lesser Air Catalysts.",
            objective: {
                type: "turnIn",
                item: "item:air_catalyst_i",
                amount: 25,
            },
            rewards: [{ currency: "currency:fame", amount: 1 }],
        },
        {
            id: "mission:water_lesser_catalyst",
            tier: 1,
            title: "The First Water Catalysts",
            description: "Turn in 25 Lesser Water Catalysts.",
            objective: {
                type: "turnIn",
                item: "item:water_catalyst_i",
                amount: 25,
            },
            rewards: [{ currency: "currency:fame", amount: 1 }],
        },
    ],
}
