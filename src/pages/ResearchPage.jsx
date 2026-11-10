import { Flex } from "../components/Flex"
import { Paper } from "../components/Paper"

export function ResearchPage() {
  return (
    <Flex direction="column">
        <Paper layer={0}><h1>Layer 0</h1></Paper>
        <Paper layer={1}><h1>Layer 0</h1></Paper>
        <Paper layer={2}><h1>Layer 0</h1></Paper>
        <Paper layer={3}><h1>Layer 0</h1></Paper>
    </Flex>
  )
}