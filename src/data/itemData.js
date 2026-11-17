import { ITEM_SPRITES } from "./iconLibrary"

// Base values are currently placeholders and can be balanced independently
// from item presentation. Each physical item type is defined exactly once.
const createItemData = (ids, variant) => ids.map(id => ({
    id,
    name: id.replace(/^item:/, "").replace(/[_-]+/g, " ")
        .replace(/\b\p{L}/gu, letter => letter.toUpperCase()),
    baseValue: 1,
    icon: ITEM_SPRITES[id],
    variant,
}))

export const ITEM_DATA = [
    ...createItemData([
        "item:loose_notes",
        "item:bound_notes",
        "item:translated_scrolls",
        "item:arcane_manuscript",
        "item:sealed_grimoire",
        "item:lost_archive_record",
        "item:forgotten_texts",
        "item:forbidden_codex",
        "item:primordial_chronicle",
        "item:genesis_testament",
    ], "research"),

    ...createItemData([
        "item:dust",
        "item:breath",
        "item:droplet",
        "item:pebble",
        "item:breeze",
        "item:ripple",
        "item:stone",
        "item:gust",
        "item:stream",
        "item:shard",
        "item:gale",
        "item:wave",
        "item:crystal",
        "item:tempest",
        "item:torrent",
        "item:core",
        "item:cyclone",
        "item:maelstrom",
        "item:mountain_heart",
        "item:skycore",
        "item:abyssal_heart",
        "item:worldheart",
        "item:firmament_core",
        "item:primordial_tide",
    ], "spellcraft"),
]

export const ITEM_DATA_BY_ID = Object.fromEntries(
    ITEM_DATA.map(item => [item.id, item])
)
