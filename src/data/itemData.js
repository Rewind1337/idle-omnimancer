import { ITEM_SPRITES } from "./iconLibrary"
import { humanize } from "../utility/helpers"

// Base values are placeholders until item values are balanced. Add new physical
// item types here so their identity, sale value, artwork and source variant stay together.
const ITEM_DEFINITIONS = [
    // Research
    { id: "item:loose_notes", baseValue: 1, variant: "research" },
    { id: "item:bound_notes", baseValue: 1, variant: "research" },
    { id: "item:translated_scrolls", baseValue: 1, variant: "research" },
    { id: "item:arcane_manuscript", baseValue: 1, variant: "research" },
    { id: "item:sealed_grimoire", baseValue: 1, variant: "research" },
    { id: "item:lost_archive_record", baseValue: 1, variant: "research" },
    { id: "item:forgotten_texts", baseValue: 1, variant: "research" },
    { id: "item:forbidden_codex", baseValue: 1, variant: "research" },
    { id: "item:primordial_chronicle", baseValue: 1, variant: "research" },
    { id: "item:genesis_testament", baseValue: 1, variant: "research" },

    // Spellcraft
    { id: "item:dust", baseValue: 1, variant: "spellcraft" },
    { id: "item:breath", baseValue: 1, variant: "spellcraft" },
    { id: "item:droplet", baseValue: 1, variant: "spellcraft" },
    { id: "item:pebble", baseValue: 1, variant: "spellcraft" },
    { id: "item:breeze", baseValue: 1, variant: "spellcraft" },
    { id: "item:ripple", baseValue: 1, variant: "spellcraft" },
    { id: "item:stone", baseValue: 1, variant: "spellcraft" },
    { id: "item:gust", baseValue: 1, variant: "spellcraft" },
    { id: "item:stream", baseValue: 1, variant: "spellcraft" },
    { id: "item:shard", baseValue: 1, variant: "spellcraft" },
    { id: "item:gale", baseValue: 1, variant: "spellcraft" },
    { id: "item:wave", baseValue: 1, variant: "spellcraft" },
    { id: "item:crystal", baseValue: 1, variant: "spellcraft" },
    { id: "item:tempest", baseValue: 1, variant: "spellcraft" },
    { id: "item:torrent", baseValue: 1, variant: "spellcraft" },
    { id: "item:core", baseValue: 1, variant: "spellcraft" },
    { id: "item:cyclone", baseValue: 1, variant: "spellcraft" },
    { id: "item:maelstrom", baseValue: 1, variant: "spellcraft" },
    { id: "item:mountain_heart", baseValue: 1, variant: "spellcraft" },
    { id: "item:skycore", baseValue: 1, variant: "spellcraft" },
    { id: "item:abyssal_heart", baseValue: 1, variant: "spellcraft" },
    { id: "item:worldheart", baseValue: 1, variant: "spellcraft" },
    { id: "item:firmament_core", baseValue: 1, variant: "spellcraft" },
    { id: "item:primordial_tide", baseValue: 1, variant: "spellcraft" },
]

export const ITEM_DATA = ITEM_DEFINITIONS.map(item => ({
    ...item,
    name: humanize(item.id),
    icon: ITEM_SPRITES[item.id],
}))

export const ITEM_DATA_BY_ID = Object.fromEntries(
    ITEM_DATA.map(item => [item.id, item])
)
