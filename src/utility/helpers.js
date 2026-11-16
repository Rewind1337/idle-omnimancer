// utility function that joins the css classes after filtering for truthyness
export const cx = (...values) => values.filter(Boolean).join(' ')

// converts a data-id to a human readable name
export const humanize = value => String(value ?? "")
    .replace("action:", " ")
    .replace("skill:", " ")
    .replace("item:", " ")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, letter => letter.toUpperCase())

// converts a name into the correct data-id
export const normalize = (name, dataType) => dataType + ":" + (name.toLowerCase().replace(/[^a-z]/g, '_'))
