import { Flex } from "../Flex"
import { Paper } from "../Paper"
import { Heading } from "../Heading"
import { humanize } from "../../utility/helpers"

export function ResourceSection({ title, resources = [] }) {
    if (resources.length === 0) return null

    return (
        <Paper layer={2}>
            <Flex direction="column">
                <Heading h="2">{title}</Heading>
                <Flex wrap>
                    {resources.map(resource => {
                        const item = typeof resource === "string" ? resource : resource.item
                        const amount = typeof resource === "string" ? 1 : resource.amount
                        return (
                            <Paper key={item} className="w-min flex-grow" layer="3">
                                {amount}x {humanize(item)}
                            </Paper>
                        )
                    })}
                </Flex>
            </Flex>
        </Paper>
    )
}
