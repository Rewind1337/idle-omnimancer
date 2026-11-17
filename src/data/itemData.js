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
    { id: "item:dust", tier: 1, variant: "spellcraft" },
    { id: "item:breath", tier: 1, variant: "spellcraft" },
    { id: "item:droplet", tier: 1, variant: "spellcraft" },
    { id: "item:pebble", tier: 2, variant: "spellcraft" },
    { id: "item:breeze", tier: 2, variant: "spellcraft" },
    { id: "item:ripple", tier: 2, variant: "spellcraft" },
    { id: "item:stone", tier: 3, variant: "spellcraft" },
    { id: "item:gust", tier: 3, variant: "spellcraft" },
    { id: "item:stream", tier: 3, variant: "spellcraft" },
    { id: "item:shard", tier: 4, variant: "spellcraft" },
    { id: "item:gale", tier: 4, variant: "spellcraft" },
    { id: "item:wave", tier: 4, variant: "spellcraft" },
    { id: "item:crystal", tier: 5, variant: "spellcraft" },
    { id: "item:tempest", tier: 5, variant: "spellcraft" },
    { id: "item:torrent", tier: 5, variant: "spellcraft" },
    { id: "item:core", tier: 6, variant: "spellcraft" },
    { id: "item:cyclone", tier: 6, variant: "spellcraft" },
    { id: "item:maelstrom", tier: 6, variant: "spellcraft" },
    { id: "item:mountain_heart", tier: 7, variant: "spellcraft" },
    { id: "item:skycore", tier: 7, variant: "spellcraft" },
    { id: "item:abyssal_heart", tier: 7, variant: "spellcraft" },
    { id: "item:worldheart", tier: 8, variant: "spellcraft" },
    { id: "item:firmament_core", tier: 8, variant: "spellcraft" },
    { id: "item:primordial_tide", tier: 8, variant: "spellcraft" },
]

export const ITEM_DATA = ITEM_DEFINITIONS.map(item => ({
    ...item,
    baseValue: getBaseItemValue(item.tier),
    name: humanize(item.id),
    icon: ITEM_SPRITES[item.id],
}))

export const ITEM_DATA_BY_ID = Object.fromEntries(
    ITEM_DATA.map(item => [item.id, item])
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
