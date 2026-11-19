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

    // Transmutation Catalyst placeholders; names and sale tiers can be tuned later.
    { id: "item:earth_catalyst_i", name: "Earth Catalyst I", tier: 1, variant: "earth", icon: OTHER_ICONS.STAR },
    { id: "item:earth_catalyst_ii", name: "Earth Catalyst II", tier: 2, variant: "earth", icon: OTHER_ICONS.STAR },
    { id: "item:earth_catalyst_iii", name: "Earth Catalyst III", tier: 3, variant: "earth", icon: OTHER_ICONS.STAR },
    { id: "item:earth_catalyst_iv", name: "Earth Catalyst IV", tier: 4, variant: "earth", icon: OTHER_ICONS.STAR },
    { id: "item:earth_catalyst_v", name: "Earth Catalyst V", tier: 5, variant: "earth", icon: OTHER_ICONS.STAR },
    { id: "item:earth_catalyst_vi", name: "Earth Catalyst VI", tier: 6, variant: "earth", icon: OTHER_ICONS.STAR },
    { id: "item:earth_catalyst_vii", name: "Earth Catalyst VII", tier: 7, variant: "earth", icon: OTHER_ICONS.STAR },
    { id: "item:earth_catalyst_viii", name: "Earth Catalyst VIII", tier: 8, variant: "earth", icon: OTHER_ICONS.STAR },
    { id: "item:air_catalyst_i", name: "Air Catalyst I", tier: 1, variant: "air", icon: OTHER_ICONS.STAR },
    { id: "item:air_catalyst_ii", name: "Air Catalyst II", tier: 2, variant: "air", icon: OTHER_ICONS.STAR },
    { id: "item:air_catalyst_iii", name: "Air Catalyst III", tier: 3, variant: "air", icon: OTHER_ICONS.STAR },
    { id: "item:air_catalyst_iv", name: "Air Catalyst IV", tier: 4, variant: "air", icon: OTHER_ICONS.STAR },
    { id: "item:air_catalyst_v", name: "Air Catalyst V", tier: 5, variant: "air", icon: OTHER_ICONS.STAR },
    { id: "item:air_catalyst_vi", name: "Air Catalyst VI", tier: 6, variant: "air", icon: OTHER_ICONS.STAR },
    { id: "item:air_catalyst_vii", name: "Air Catalyst VII", tier: 7, variant: "air", icon: OTHER_ICONS.STAR },
    { id: "item:air_catalyst_viii", name: "Air Catalyst VIII", tier: 8, variant: "air", icon: OTHER_ICONS.STAR },
    { id: "item:water_catalyst_i", name: "Water Catalyst I", tier: 1, variant: "water", icon: OTHER_ICONS.STAR },
    { id: "item:water_catalyst_ii", name: "Water Catalyst II", tier: 2, variant: "water", icon: OTHER_ICONS.STAR },
    { id: "item:water_catalyst_iii", name: "Water Catalyst III", tier: 3, variant: "water", icon: OTHER_ICONS.STAR },
    { id: "item:water_catalyst_iv", name: "Water Catalyst IV", tier: 4, variant: "water", icon: OTHER_ICONS.STAR },
    { id: "item:water_catalyst_v", name: "Water Catalyst V", tier: 5, variant: "water", icon: OTHER_ICONS.STAR },
    { id: "item:water_catalyst_vi", name: "Water Catalyst VI", tier: 6, variant: "water", icon: OTHER_ICONS.STAR },
    { id: "item:water_catalyst_vii", name: "Water Catalyst VII", tier: 7, variant: "water", icon: OTHER_ICONS.STAR },
    { id: "item:water_catalyst_viii", name: "Water Catalyst VIII", tier: 8, variant: "water", icon: OTHER_ICONS.STAR },
]

// Add repeatable, shop-only goods here. Do not add these IDs to skill action outputs.
// Example: { id: "item:minor_tonic", name: "Minor Tonic", tier: 1, shopPrice: 100, description: "A simple restorative.", variant: "shop", icon: OTHER_ICONS.STAR }
export const SHOP_ITEM_DEFINITIONS = []

const ALL_ITEM_DEFINITIONS = [...ITEM_DEFINITIONS, ...SHOP_ITEM_DEFINITIONS]

export const ITEM_DATA = ALL_ITEM_DEFINITIONS.map(item => ({
    ...item,
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
]

export const CURRENCY_DATA_BY_ID = Object.fromEntries(
    CURRENCY_DATA.map(currency => [currency.id, currency])
)
