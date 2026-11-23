// Joins CSS classes after removing falsy values.
export const cx = (...values) => values.filter(Boolean).join(' ')

// Formats values without exposing floating-point calculation noise.
export const formatNumber = value => {
    const number = Number(value)
    if (!Number.isFinite(number)) return String(value ?? 0)
    return Number(number.toFixed(2)).toLocaleString()
}

// Formats large values with the game's shared incremental-number suffixes.
const NUMBER_SUFFIXES = [
    { threshold: 1e24, suffix: "Sp" },
    { threshold: 1e21, suffix: "Sx" },
    { threshold: 1e18, suffix: "Qu" },
    { threshold: 1e15, suffix: "Q" },
    { threshold: 1e12, suffix: "T" },
    { threshold: 1e9, suffix: "B" },
    { threshold: 1e6, suffix: "M" },
    { threshold: 1e3, suffix: "K" },
]

export const formatCompactNumber = value => {
    const number = Number(value)
    if (!Number.isFinite(number)) return String(value ?? 0)

    const absoluteValue = Math.abs(number)
    const suffix = NUMBER_SUFFIXES.find(entry => absoluteValue >= entry.threshold)

    if (!suffix) return formatNumber(number)

    const scaledValue = Number((absoluteValue / suffix.threshold).toFixed(3))
    return (number < 0 ? "−" : "") + scaledValue + suffix.suffix
}

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
