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
        {
            id: "mission:crossroads_field_notes",
            tier: 1,
            title: "Notes from the Crossroads",
            description: "Turn in 100 Crossroads Field Notes.",
            objective: {
                type: "turnIn",
                item: "item:crossroads_field_notes",
                amount: 100,
            },
            rewards: [{ currency: "currency:fame", amount: 1 }],
        },

        /* Tier 2 Missions */
        {
            id: "mission:research_bound_notes",
            tier: 2,
            title: "A Deeper Study",
            description: "Turn in 250 Bound Notes.",
            objective: { type: "turnIn", item: "item:bound_notes", amount: 250 },
            rewards: [{ currency: "currency:fame", amount: 2 }],
        },
        {
            id: "mission:earth_pebbles",
            tier: 2,
            title: "A Firmer Foundation",
            description: "Turn in 250 Pebbles.",
            objective: { type: "turnIn", item: "item:pebble", amount: 250 },
            rewards: [{ currency: "currency:fame", amount: 2 }],
        },
        {
            id: "mission:air_breezes",
            tier: 2,
            title: "Winds Gathering",
            description: "Turn in 250 Breezes.",
            objective: { type: "turnIn", item: "item:breeze", amount: 250 },
            rewards: [{ currency: "currency:fame", amount: 2 }],
        },
        {
            id: "mission:water_ripples",
            tier: 2,
            title: "A Stronger Current",
            description: "Turn in 250 Ripples.",
            objective: { type: "turnIn", item: "item:ripple", amount: 250 },
            rewards: [{ currency: "currency:fame", amount: 2 }],
        },
        {
            id: "mission:earth_weak_catalysts",
            tier: 2,
            title: "Strengthened Earth Catalysts",
            description: "Turn in 50 Weak Earth Catalysts.",
            objective: { type: "turnIn", item: "item:earth_catalyst_ii", amount: 50 },
            rewards: [{ currency: "currency:fame", amount: 2 }],
        },
        {
            id: "mission:air_weak_catalysts",
            tier: 2,
            title: "Strengthened Air Catalysts",
            description: "Turn in 50 Weak Air Catalysts.",
            objective: { type: "turnIn", item: "item:air_catalyst_ii", amount: 50 },
            rewards: [{ currency: "currency:fame", amount: 2 }],
        },
        {
            id: "mission:water_weak_catalysts",
            tier: 2,
            title: "Strengthened Water Catalysts",
            description: "Turn in 50 Weak Water Catalysts.",
            objective: { type: "turnIn", item: "item:water_catalyst_ii", amount: 50 },
            rewards: [{ currency: "currency:fame", amount: 2 }],
        },
        {
            id: "mission:three_element_exploration",
            tier: 2,
            title: "The Threefold Expedition",
            description: "Turn in 100 Mossbound Ore, 100 Whispering Seeds and 100 Stillwater Reeds.",
            objective: {
                type: "turnIn",
                items: [
                    { item: "item:mossbound_ore", amount: 100 },
                    { item: "item:whispering_seeds", amount: 100 },
                    { item: "item:stillwater_reeds", amount: 100 },
                ],
            },
            rewards: [{ currency: "currency:fame", amount: 2 }],
        },
    ],
}
