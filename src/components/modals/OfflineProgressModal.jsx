import { Button } from "../Button"
import { Flex } from "../Flex"
import { Heading } from "../Heading"
import { Modal } from "../Modal"
import { Paper } from "../Paper"
import { Progress } from "../Progress"
import { Text } from "../Text"

const formatDuration = (milliseconds) => {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    const parts = []

    if (days > 0) parts.push(days + "d")
    if (hours > 0) parts.push(hours + "h")
    if (minutes > 0) parts.push(minutes + "m")
    if (seconds > 0 || parts.length === 0) parts.push(seconds + "s")

    return parts.join(" ")
}

export function OfflineProgressModal({ progress, onContinue }) {
    if (!progress?.visible) return null

    const totalMs = Math.max(0, progress.totalMs ?? 0)
    const processedMs = Math.min(totalMs, Math.max(0, progress.processedMs ?? 0))
    const remainingMs = Math.max(0, totalMs - processedMs)
    const percentage = totalMs > 0 ? (processedMs / totalMs) * 100 : 100
    const completed = Boolean(progress.completed)

    return (
        <Modal
            visible
            variant="shop"
            className="modal-offline-progress"
            onBackdropClick={() => {
                if (completed) onContinue()
            }}
            header={<Heading h="1">{completed ? "Offline Progress Complete" : "Welcome Back"}</Heading>}
            content={
                <Flex direction="column" gap={16}>
                    <Text>
                        {completed
                            ? "Your offline activity has been simulated."
                            : "Calculating the progress made while you were away..."}
                    </Text>
                    <Progress
                        layer={1}
                        variant="shop"
                        size="large"
                        percentage={percentage}
                        label={percentage.toFixed(1) + "%"}
                    />
                    <Flex direction="row" wrap gap={8}>
                        <Paper layer={2}>
                            <Heading h="5">Total Offline Time</Heading>
                            <Heading h="3">{formatDuration(totalMs)}</Heading>
                        </Paper>
                        <Paper layer={2}>
                            <Heading h="5">Simulated</Heading>
                            <Heading h="3">{formatDuration(processedMs)}</Heading>
                        </Paper>
                        <Paper layer={2}>
                            <Heading h="5">Remaining</Heading>
                            <Heading h="3">{formatDuration(remainingMs)}</Heading>
                        </Paper>
                    </Flex>
                    <Heading h="3">Resource Gains</Heading>
                    <Paper layer={2}>
                        <Flex direction="column" gap={6}>
                            {progress.feed?.length > 0
                                ? progress.feed.map((entry, index) => (
                                    <Text key={entry.key ?? index} size="small">{entry.text ?? entry}</Text>
                                ))
                                : <Text size="small">No resource gains recorded yet.</Text>}
                        </Flex>
                    </Paper>
                </Flex>
            }
            footer={completed
                ? <Button variant="shop" onClick={onContinue}>Continue</Button>
                : <Text size="small">Offline progress is being calculated...</Text>}
        />
    )
}
