// Joins CSS classes after removing falsy values.
export const cx = (...values) => values.filter(Boolean).join(' ')

// Removes a known data-type prefix and turns an ID into a readable label.
// Examples: "action:read_books" -> "Read Books", "item:loose_notes" -> "Loose Notes",
 // and "currency:coins" -> "Coins".
export const humanize = (value) => String(value ?? "")
    .replace(/^(?:skill|action|item|currency):/i, "")
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\p{L}/gu, letter => letter.toUpperCase())

// Converts a readable label (or an already-prefixed ID) into a typed data ID.
// The supplied dataType is deliberately explicit: normalize("Loose Notes", "item")
// returns "item:loose_notes". This is reversible at the ID/label level, not a
// lossless encoding of original capitalization or punctuation.
export const normalize = (name, dataType) => {
    const type = String(dataType ?? "").trim().toLowerCase()
    const value = String(name ?? "").trim()

    if (!type) {
        throw new Error("normalize requires a dataType.")
    }

    // Avoid double-prefixing when the caller supplies an ID of the same type.
    const unprefixed = value.replace(new RegExp("^" + type + ":"), "")

    const normalized = unprefixed
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")

    return type + ":" + normalized
}
