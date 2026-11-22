import { ITEM_SPRITES, OTHER_ICONS } from "./iconLibrary"
import { humanize } from "../utility/helpers"

// Tier 1 and 2 establish the value curve; every later tier doubles the previous
// value minus one: 1, 2, 3, 5, 9, 17, 33, 65, ...
export const getBaseItemValue = (tier) => {
    const normalizedTier = Math.max(1, Math.floor(Number(tier) || 1))

    if (normalizedTier === 1) return 1
    if (normalizedTier === 2) return 2

    return Math.round((getBaseItemValue(normalizedTier - 1) * 2) - 1)
}

const ITEM_DEFINITIONS = [
    // Research
    { id: "item:loose_notes", tier: 1, variant: "research" },
    { id: "item:bound_notes", tier: 2, variant: "research" },
    { id: "item:translated_scrolls", tier: 3, variant: "research" },
    { id: "item:arcane_manuscript", tier: 4, variant: "research" },
    { id: "item:sealed_grimoire", tier: 5, variant: "research" },
    { id: "item:lost_archive_record", tier: 6, variant: "research" },
    { id: "item:forgotten_texts", tier: 7, variant: "research" },
    { id: "item:forbidden_codex", tier: 8, variant: "research" },
    { id: "item:primordial_chronicle", tier: 9, variant: "research" },
    { id: "item:genesis_testament", tier: 10, variant: "research" },

    // Spellcraft
    { id: "item:dust", tier: 1, variant: "earth" },
    { id: "item:breath", tier: 1, variant: "air" },
    { id: "item:droplet", tier: 1, variant: "water" },
    { id: "item:pebble", tier: 2, variant: "earth" },
    { id: "item:breeze", tier: 2, variant: "air" },
    { id: "item:ripple", tier: 2, variant: "water" },
    { id: "item:stone", tier: 3, variant: "earth" },
    { id: "item:gust", tier: 3, variant: "air" },
    { id: "item:stream", tier: 3, variant: "water" },
    { id: "item:shard", tier: 4, variant: "earth" },
    { id: "item:gale", tier: 4, variant: "air" },
    { id: "item:wave", tier: 4, variant: "water" },
    { id: "item:crystal", tier: 5, variant: "earth" },
    { id: "item:tempest", tier: 5, variant: "air" },
    { id: "item:torrent", tier: 5, variant: "water" },
    { id: "item:core", tier: 6, variant: "earth" },
    { id: "item:cyclone", tier: 6, variant: "air" },
    { id: "item:maelstrom", tier: 6, variant: "water" },
    { id: "item:mountain_heart", tier: 7, variant: "earth" },
    { id: "item:skycore", tier: 7, variant: "air" },
    { id: "item:abyssal_heart", tier: 7, variant: "water" },
    { id: "item:worldheart", tier: 8, variant: "earth" },
    { id: "item:firmament_core", tier: 8, variant: "air" },
    { id: "item:primordial_tide", tier: 8, variant: "water" },

    // Unique resources produced by each Exploration area.
    { id: "item:crossroads_field_notes", tier: 2, variant: "exploration", type: "resource" },
    { id: "item:mossbound_ore", tier: 2, variant: "earth", type: "resource" },
    { id: "item:whispering_seeds", tier: 2, variant: "air", type: "resource" },
    { id: "item:stillwater_reeds", tier: 2, variant: "water", type: "resource" },
    { id: "item:ironroot_ore", tier: 3, variant: "earth", type: "resource" },
    { id: "item:zephyr_plumes", tier: 3, variant: "air", type: "resource" },
    { id: "item:moonlit_pearls", tier: 3, variant: "water", type: "resource" },
    { id: "item:shatterstone_fragments", tier: 4, variant: "earth", type: "resource" },
    { id: "item:stormglass_shards", tier: 4, variant: "air", type: "resource" },
    { id: "item:abyssal_ink", tier: 4, variant: "water", type: "resource" },
    { id: "item:basalt_heart", tier: 5, variant: "earth", type: "resource" },
    { id: "item:skybreak_aether", tier: 5, variant: "air", type: "resource" },
    { id: "item:tidal_heart", tier: 5, variant: "water", type: "resource" },

    // Higher-tier Exploration resources.
    { id: "item:deepstone_crystals", tier: 6, variant: "earth", type: "resource" },
    { id: "item:highwind_plumes", tier: 6, variant: "air", type: "resource" },
    { id: "item:mooncurrent_pearls", tier: 6, variant: "water", type: "resource" },
    { id: "item:verdant_heartwood", tier: 7, variant: "earth", type: "resource" },
    { id: "item:stormwing_feathers", tier: 7, variant: "air", type: "resource" },
    { id: "item:glacial_pearls", tier: 7, variant: "water", type: "resource" },
    { id: "item:obsidian_fragments", tier: 8, variant: "earth", type: "resource" },
    { id: "item:celestial_aether", tier: 8, variant: "air", type: "resource" },
    { id: "item:abyssal_corals", name: "Abyssal Bones", tier: 8, variant: "water", type: "resource" },
    { id: "item:primordial_ore", tier: 9, variant: "earth", type: "resource" },
    { id: "item:starfall_aether", tier: 9, variant: "air", type: "resource" },
    { id: "item:worldtide_pearls", tier: 9, variant: "water", type: "resource" },
    { id: "item:worldcore_shards", tier: 10, variant: "earth", type: "resource" },
    { id: "item:firmament_plumes", tier: 10, variant: "air", type: "resource" },
    { id: "item:leviathan_essence", tier: 10, variant: "water", type: "resource" },
    { id: "item:genesis_ore", tier: 11, variant: "earth", type: "resource" },
    { id: "item:origin_aether", tier: 11, variant: "air", type: "resource" },
    { id: "item:eternal_tideheart", tier: 11, variant: "water", type: "resource" },

    // Companion containers discovered by exploration for use in the Unveiling systems & Companion Tab.
    { id: "item:earth_geode_i", tier: 1, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 5, type: "companionContainer" },
    { id: "item:air_egg_i", tier: 1, variant: "air", baseValue: 1000, requiredUnveilingLevel: 5, type: "companionContainer" },
    { id: "item:water_shell_i", tier: 1, variant: "water", baseValue: 1000, requiredUnveilingLevel: 5, type: "companionContainer" },
    { id: "item:earth_geode_ii", tier: 2, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 10, type: "companionContainer" },
    { id: "item:air_egg_ii", tier: 2, variant: "air", baseValue: 1000, requiredUnveilingLevel: 10, type: "companionContainer" },
    { id: "item:water_shell_ii", tier: 2, variant: "water", baseValue: 1000, requiredUnveilingLevel: 10, type: "companionContainer" },
    { id: "item:earth_geode_iii", tier: 3, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 15, type: "companionContainer" },
    { id: "item:air_egg_iii", tier: 3, variant: "air", baseValue: 1000, requiredUnveilingLevel: 15, type: "companionContainer" },
    { id: "item:water_shell_iii", tier: 3, variant: "water", baseValue: 1000, requiredUnveilingLevel: 15, type: "companionContainer" },
    { id: "item:earth_geode_iv", tier: 4, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 20, type: "companionContainer" },
    { id: "item:air_egg_iv", tier: 4, variant: "air", baseValue: 1000, requiredUnveilingLevel: 20, type: "companionContainer" },
    { id: "item:water_shell_iv", tier: 4, variant: "water", baseValue: 1000, requiredUnveilingLevel: 20, type: "companionContainer" },
    { id: "item:earth_geode_v", tier: 5, variant: "earth", baseValue: 1000, requiredUnveilingLevel: 25, type: "companionContainer" },
    { id: "item:air_egg_v", tier: 5, variant: "air", baseValue: 1000, requiredUnveilingLevel: 25, type: "companionContainer" },
    { id: "item:water_shell_v", tier: 5, variant: "water", baseValue: 1000, requiredUnveilingLevel: 25, type: "companionContainer" },

    // Companion progression materials and the shared low-value duplicate reward.
    { id: "item:earth_companion_xp", name: "Earth Companion Candy", tier: 1, variant: "earth", type: "companionExperience", baseValue: 0 },
    { id: "item:air_companion_xp", name: "Air Companion Candy", tier: 1, variant: "air", type: "companionExperience", baseValue: 0 },
    { id: "item:water_companion_xp", name: "Water Companion Candy", tier: 1, variant: "water", type: "companionExperience", baseValue: 0 },

    // Unique area artifacts reserved for the Combat and Unveiling systems.
    { id: "item:crossroads_waystone", tier: 1, variant: "exploration", type: "artifact" },
    { id: "item:mossbound_heartstone", tier: 1, variant: "earth", type: "artifact" },
    { id: "item:whispering_chime", tier: 1, variant: "air", type: "artifact" },
    { id: "item:stillwater_idol", tier: 1, variant: "water", type: "artifact" },
    { id: "item:ironroot_golem_core", tier: 2, variant: "earth", type: "artifact" },
    { id: "item:zephyr_wisp_chime", tier: 2, variant: "air", type: "artifact" },
    { id: "item:fenwarden_idol", tier: 2, variant: "water", type: "artifact" },
    { id: "item:cragbound_relic", tier: 3, variant: "earth", type: "artifact" },
    { id: "item:tempest_eye", tier: 3, variant: "air", type: "artifact" },
    { id: "item:drowned_scepter", tier: 3, variant: "water", type: "artifact" },
    { id: "item:basalt_crown_fragment", tier: 4, variant: "earth", type: "artifact" },
    { id: "item:skybreak_sigil", tier: 4, variant: "air", type: "artifact" },
    { id: "item:abyssal_crown", tier: 4, variant: "water", type: "artifact" },

    { id: "item:deepstone_guardian_core", tier: 5, variant: "earth", type: "artifact" },
    { id: "item:highwind_wisp_chime", tier: 5, variant: "air", type: "artifact" },
    { id: "item:mooncurrent_tide_idol", tier: 5, variant: "water", type: "artifact" },
    { id: "item:verdant_golem_core", tier: 6, variant: "earth", type: "artifact" },
    { id: "item:stormwing_wisp_chime", tier: 6, variant: "air", type: "artifact" },
    { id: "item:glacial_tide_idol", tier: 6, variant: "water", type: "artifact" },
    { id: "item:obsidian_golem_relic", tier: 7, variant: "earth", type: "artifact" },
    { id: "item:celestial_wisp_chime", tier: 7, variant: "air", type: "artifact" },
    { id: "item:abyssal_tide_scepter", tier: 7, variant: "water", type: "artifact" },
    { id: "item:primordial_golem_heart", tier: 8, variant: "earth", type: "artifact" },
    { id: "item:starfall_wisp_sigil", tier: 8, variant: "air", type: "artifact" },
    { id: "item:worldtide_tide_crown", tier: 8, variant: "water", type: "artifact" },
    { id: "item:worldcore_relic", tier: 9, variant: "earth", type: "artifact" },
    { id: "item:firmament_wisp_chime", tier: 9, variant: "air", type: "artifact" },
    { id: "item:leviathan_tide_scepter", tier: 9, variant: "water", type: "artifact" },
    { id: "item:genesis_golem_core", tier: 10, variant: "earth", type: "artifact" },
    { id: "item:origin_wisp_sigil", tier: 10, variant: "air", type: "artifact" },
    { id: "item:eternal_tide_crown", tier: 10, variant: "water", type: "artifact" },

    // Transmutation Catalyst placeholders; names and sale tiers can be tuned later.
    { id: "item:earth_catalyst_i", name: "Lesser Earth Catalyst", tier: 2, variant: "earth" },
    { id: "item:earth_catalyst_ii", name: "Weak Earth Catalyst", tier: 3, variant: "earth" },
    { id: "item:earth_catalyst_iii", name: "Regular Earth Catalyst", tier: 4, variant: "earth" },
    { id: "item:earth_catalyst_iv", name: "Greater Earth Catalyst", tier: 5, variant: "earth" },
    { id: "item:earth_catalyst_v", name: "Superior Earth Catalyst", tier: 6, variant: "earth" },
    { id: "item:earth_catalyst_vi", name: "Exalted Earth Catalyst", tier: 7, variant: "earth" },
    { id: "item:earth_catalyst_vii", name: "Supreme Earth Catalyst", tier: 8, variant: "earth" },
    { id: "item:earth_catalyst_viii", name: "Transcendent Earth Catalyst", tier: 9, variant: "earth" },
    { id: "item:air_catalyst_i", name: "Lesser Air Catalyst", tier: 2, variant: "air" },
    { id: "item:air_catalyst_ii", name: "Weak Air Catalyst", tier: 3, variant: "air" },
    { id: "item:air_catalyst_iii", name: "Regular Air Catalyst", tier: 4, variant: "air" },
    { id: "item:air_catalyst_iv", name: "Greater Air Catalyst", tier: 5, variant: "air" },
    { id: "item:air_catalyst_v", name: "Superior Air Catalyst", tier: 6, variant: "air" },
    { id: "item:air_catalyst_vi", name: "Exalted Air Catalyst", tier: 7, variant: "air" },
    { id: "item:air_catalyst_vii", name: "Supreme Air Catalyst", tier: 8, variant: "air" },
    { id: "item:air_catalyst_viii", name: "Transcendent Air Catalyst", tier: 9, variant: "air" },
    { id: "item:water_catalyst_i", name: "Lesser Water Catalyst", tier: 2, variant: "water" },
    { id: "item:water_catalyst_ii", name: "Weak Water Catalyst", tier: 3, variant: "water" },
    { id: "item:water_catalyst_iii", name: "Regular Water Catalyst", tier: 4, variant: "water" },
    { id: "item:water_catalyst_iv", name: "Greater Water Catalyst", tier: 5, variant: "water" },
    { id: "item:water_catalyst_v", name: "Superior Water Catalyst", tier: 6, variant: "water" },
    { id: "item:water_catalyst_vi", name: "Exalted Water Catalyst", tier: 7, variant: "water" },
    { id: "item:water_catalyst_vii", name: "Supreme Water Catalyst", tier: 8, variant: "water" },
    { id: "item:water_catalyst_viii", name: "Transcendent Water Catalyst", tier: 9, variant: "water" },
]

// Add repeatable, shop-only goods here. Do not add these IDs to skill action outputs.
// Example: { id: "item:minor_tonic", name: "Minor Tonic", tier: 1, shopPrice: 100, description: "A simple restorative.", variant: "shop", icon: OTHER_ICONS.STAR }
export const SHOP_ITEM_DEFINITIONS = []

const ALL_ITEM_DEFINITIONS = [...ITEM_DEFINITIONS, ...SHOP_ITEM_DEFINITIONS]

const getItemClassification = (item) => {
    if (item.shopPrice !== undefined || item.variant === "shop") {
        return { group: "shop", type: "shopItem" }
    }
    if (item.type === "companionContainer" || item.type === "companionExperience" || item.type === "companionTrinket") {
        return { group: "companions", type: item.type }
    }
    if (item.type === "artifact") {
        return { group: "combat", type: "artifact" }
    }
    if (item.type === "resource") {
        return { group: "exploration", type: "resource" }
    }
    if (item.id.includes("_catalyst_")) {
        return { group: "transmutation", type: "catalyst" }
    }
    if (item.variant === "research") {
        return { group: "research", type: "researchMaterial" }
    }
    return { group: "spellcraft", type: "essence" }
}

export const ITEM_DATA = ALL_ITEM_DEFINITIONS.map(item => ({
    ...item,
    ...getItemClassification(item),
    baseValue: item.baseValue ?? getBaseItemValue(item.tier),
    name: item.name ?? humanize(item.id.replace(/^item:/, "")),
    icon: item.icon ?? ITEM_SPRITES[item.id] ?? OTHER_ICONS.STAR,
}))

export const ITEM_DATA_BY_ID = Object.fromEntries(
    ITEM_DATA.map(item => [item.id, item])
)

export const SHOP_ITEM_DATA = ITEM_DATA.filter(item =>
    Number.isFinite(item.shopPrice) && item.shopPrice >= 0
)

export const SHOP_ITEM_DATA_BY_ID = Object.fromEntries(
    SHOP_ITEM_DATA.map(item => [item.id, item])
)

// Currencies are deliberately kept out of ITEM_DATA and ITEM_DATA_BY_ID.
// They are balances, not physical inventory entries, and never consume bag slots.
export const CURRENCY_DATA = [
    {
        id: "currency:coins",
        name: "Coins",
        icon: OTHER_ICONS.COINS,
        variant: "shop",
        type: "currency",
    },
    {
        id: "currency:fame",
        name: "Fame",
        icon: OTHER_ICONS.STAR,
        variant: "primary",
        type: "currency",
    },
]

export const CURRENCY_DATA_BY_ID = Object.fromEntries(
    CURRENCY_DATA.map(currency => [currency.id, currency])
)


// Return only owned items in a source group or semantic type. These helpers are
// shared by inventory filtering and Unveiling's Material Destruction actions.
export const getInventoryItemsByGroup = (inventory, group) =>
    ITEM_DATA
        .filter(item => item.group === group && (inventory?.[item.id] ?? 0) > 0)
        .map(item => ({ ...item, amount: inventory[item.id] }))

export const getInventoryItemsByType = (inventory, type) =>
    ITEM_DATA
        .filter(item => item.type === type && (inventory?.[item.id] ?? 0) > 0)
        .map(item => ({ ...item, amount: inventory[item.id] }))
