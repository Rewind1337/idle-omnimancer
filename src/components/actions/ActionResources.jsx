import { Flex } from "../Flex"
import { cx } from "../../utility/helpers"
import { ResourceSection } from "./ResourceSection"

export function ActionResources({
    className = "",
    consumes = [],
    produces = [],
    requires = [],
    outputMultiplier = 1,
}) {
    return (
        <Flex className={cx("action-resources", className)} align="start" justify="start">
            <ResourceSection title="Consumes:" resources={consumes} />
            <ResourceSection title="Produces:" resources={produces} amountMultiplier={outputMultiplier} />
            <ResourceSection title="Requires:" resources={requires} />
        </Flex>
    )
}
