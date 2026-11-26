import { Badge } from "./Badge"
import { Button } from "./Button"
import { Flex } from "./Flex"
import { Heading } from "./Heading"
import { Paper } from "./Paper"
import { Progress } from "./Progress"
import { Text } from "./Text"
import { Tooltip } from "./Tooltip"

import { OTHER_ICONS } from "../data/iconLibrary"
import { TIME_ENERGY_CONFIG } from "../data/zenConfig"
import { useGame, useGameTimeEnergy } from "../hooks/useGame"

import "./TimeEnergyPanel.scss"

const formatDuration = milliseconds => {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) return hours + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
    return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
}

export function TimeEnergyPanel({ inline = false }) {
    const { player, toggleTimeAcceleration } = useGame()
    const timeEnergy = useGameTimeEnergy()

    if (!player.timeEnergy?.unlocked) return null

    const currentMs = Math.min(TIME_ENERGY_CONFIG.capMs, Math.max(0, timeEnergy.currentMs))
    const percentage = (currentMs / TIME_ENERGY_CONFIG.capMs) * 100
    const hasEnergy = currentMs > 0
    const accelerationEnabled = timeEnergy.accelerationEnabled

    return (
        <Paper
            layer={inline ? 1 : 2}
            variant="zen"
            padding={inline ? 16 : 12}
            className={inline ? "time-energy-panel time-energy-panel-inline" : "time-energy-panel time-energy-panel-floating"}
        >
            <Flex direction="column" gap={8}>
                <Flex direction="row" align="center" justify="space-between">
                    <Flex direction="row" gap={8} align="center">
                        {OTHER_ICONS.HOURGLASS}
                        <Heading h="3" variant="zen">Time Energy</Heading>
                    </Flex>
                    <Badge
                        variant="zen"
                        size="small"
                        icon={OTHER_ICONS.SPARKLES}
                        tooltip="Stored energy is used only while actions, meditation, or passive gameplay can progress."
                    >
                        {hasEnergy ? "Stored" : "Empty"}
                    </Badge>
                </Flex>

                <Flex direction="column" gap={4}>
                    <Flex direction="row" justify="space-between">
                        <Text size="small">{formatDuration(currentMs)}</Text>
                        <Text size="small">2:00:00</Text>
                    </Flex>
                    <Progress
                        variant="zen"
                        size="small"
                        corners="rounded"
                        percentage={percentage}
                        label={percentage.toFixed(1) + "%"}
                    />
                </Flex>

                <Tooltip content="When enabled, the game simulates up to one additional second for every second of stored Time Energy. Energy is only spent while eligible progression is occurring.">
                    <Button
                        variant="zen"
                        size="medium"
                        className="w-100"
                        icon={OTHER_ICONS.REPEAT2}
                        toggled={accelerationEnabled && hasEnergy}
                        checked={accelerationEnabled}
                        onClick={toggleTimeAcceleration}
                        aria-label="Toggle 2× Time Energy acceleration"
                    >
                        {accelerationEnabled ? "2× Acceleration Enabled" : "Enable 2× Acceleration"}
                    </Button>
                </Tooltip>
                {!inline && (
                    <Text size="xsmall" className="time-energy-caption">
                        1 second stored = 1 extra second of simulation
                    </Text>
                )}
            </Flex>
        </Paper>
    )
}
