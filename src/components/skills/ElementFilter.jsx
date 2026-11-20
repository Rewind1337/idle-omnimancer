import { Flex } from "../Flex"
import { Button } from "../Button"
import { ELEMENT_ICONS } from "../../data/iconLibrary"

const ELEMENT_FILTERS = [
    { id: "all", label: "All" },
    { id: "earth", label: "Earth", icon: ELEMENT_ICONS.EARTH },
    { id: "air", label: "Air", icon: ELEMENT_ICONS.AIR },
    { id: "water", label: "Water", icon: ELEMENT_ICONS.WATER },
]

export function ElementFilter({ value, onChange, variant }) {
    return (
        <Flex direction="row" wrap gap={8} className="element-filter">
            {ELEMENT_FILTERS.map(element => (
                <Button
                    key={element.id}
                    size="small"
                    variant={element.id === "all" ? variant : element.id}
                    icon={element.icon}
                    checked={value === element.id}
                    onClick={() => onChange(element.id)}
                >
                    {element.label}
                </Button>
            ))}
        </Flex>
    )
}
