import { Flex } from "../Flex"
import { Button } from "../Button"
import { ELEMENT_ICONS } from "../../data/iconLibrary"
import { Heading } from "../Heading"

const ELEMENT_FILTERS = [
    { id: "all", label: "All", icon: ELEMENT_ICONS.ALL },
    { id: "earth", label: "Earth", icon: ELEMENT_ICONS.EARTH },
    { id: "air", label: "Air", icon: ELEMENT_ICONS.AIR },
    { id: "water", label: "Water", icon: ELEMENT_ICONS.WATER },
]

export function ElementFilter({ value, onChange, variant }) {
    return (
        <Flex direction="column">
            <Heading h="3" className="w-100 align-center">Filter Actions by Element</Heading>
            <Flex direction="row" wrap gap={8} className="element-filter" justify="center" align="center">
                {ELEMENT_FILTERS.map(element => (
                    <Button
                        key={element.id}
                        size="large"
                        className="w-10"
                        variant={element.id === "all" ? variant : element.id}
                        icon={element.icon}
                        checked={value === element.id}
                        onClick={() => onChange(element.id)}
                    >
                        {element.label}
                    </Button>
                ))}
            </Flex>
        </Flex>
    )
}
