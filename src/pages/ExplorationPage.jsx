import { cloneElement, useRef, useState } from "react"

import { Badge } from "../components/Badge"
import { Button } from "../components/Button"
import { Flex } from "../components/Flex"
import { Heading } from "../components/Heading"
import { Icon } from "../components/Icon"
import { Paper } from "../components/Paper"
import { Text } from "../components/Text"
import { SkillSummary } from "../components/skills/SkillSummary"

import { EXPLORATION_CONFIG } from "../data/explorationConfig"
import { WORLD_AREAS, WORLD_AREA_BY_ID, WORLD_DATA } from "../data/worldData"
import { SKILL_ICONS } from "../data/iconLibrary"
import { humanize } from "../utility/helpers"

import "./ExplorationPage.scss"

const HEX_SIZE = 65
const MAP_CENTER = { x: 400, y: 260 }
const MIN_ZOOM = 0.65
const MAX_ZOOM = 1.8

const getAreaPosition = area => ({
    x: HEX_SIZE * Math.sqrt(3) * (area.position.q + area.position.r / 2),
    y: HEX_SIZE * 1.5 * area.position.r,
})

const getHexPoints = () => Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI / 3) * index - Math.PI / 2
    return `${Math.cos(angle) * HEX_SIZE},${Math.sin(angle) * HEX_SIZE}`
}).join(" ")

const getConnectionLines = () => {
    const seenConnections = new Set()

    return WORLD_AREAS.flatMap(area => (area.connections ?? []).flatMap(connectionId => {
        const connectedArea = WORLD_AREA_BY_ID[connectionId]
        if (!connectedArea) return []

        const key = [area.id, connectedArea.id].sort().join("::")
        if (seenConnections.has(key)) return []
        seenConnections.add(key)

        return [{
            id: key,
            start: getAreaPosition(area),
            end: getAreaPosition(connectedArea),
        }]
    }))
}

function ExplorationMap({ selectedAreaId, onSelectArea }) {
    const [view, setView] = useState({ x: 0, y: 0, scale: 1 })
    const [isDragging, setIsDragging] = useState(false)
    const dragRef = useRef(null)
    const hexPoints = getHexPoints()
    const connectionLines = getConnectionLines()

    const stopDragging = () => {
        const drag = dragRef.current
        const moved = Boolean(drag?.moved)
        dragRef.current = null
        setIsDragging(false)

        if (!moved && drag?.areaId) onSelectArea(drag.areaId)
    }

    const handlePointerDown = event => {
        if (event.button !== 0) return

        const area = event.target.closest?.("[data-area-id]")
        dragRef.current = {
            startX: event.clientX,
            startY: event.clientY,
            viewX: view.x,
            viewY: view.y,
            areaId: area?.getAttribute("data-area-id") ?? null,
            moved: false,
        }
        event.currentTarget.setPointerCapture?.(event.pointerId)
    }

    const handlePointerMove = event => {
        if (!dragRef.current) return

        const deltaX = event.clientX - dragRef.current.startX
        const deltaY = event.clientY - dragRef.current.startY
        if (Math.abs(deltaX) + Math.abs(deltaY) > 4) {
            dragRef.current.moved = true
            setIsDragging(true)
        }

        if (dragRef.current.moved) {
            setView(current => ({
                ...current,
                x: dragRef.current.viewX + deltaX,
                y: dragRef.current.viewY + deltaY,
            }))
        }
    }

    const zoomBy = factor => {
        setView(current => ({
            ...current,
            scale: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, current.scale * factor)),
        }))
    }

    const resetView = () => setView({ x: 0, y: 0, scale: 1 })

    return (
        <div className={`exploration-map ${isDragging ? "is-dragging" : ""}`}>
            <svg
                className="exploration-map-svg"
                viewBox="0 0 800 520"
                role="group"
                aria-label="Exploration hex map. Drag to move and scroll to zoom."
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={stopDragging}
                onPointerCancel={() => {
                    dragRef.current = null
                    setIsDragging(false)
                }}
                onWheel={event => {
                    event.preventDefault()
                    zoomBy(event.deltaY < 0 ? 1.1 : 0.9)
                }}
            >
                <g transform={`translate(${MAP_CENTER.x + view.x} ${MAP_CENTER.y + view.y}) scale(${view.scale})`}>
                    <g className="exploration-map-connections">
                        {connectionLines.map(connection => (
                            <line
                                key={connection.id}
                                x1={connection.start.x}
                                y1={connection.start.y}
                                x2={connection.end.x}
                                y2={connection.end.y}
                            />
                        ))}
                    </g>
                    {WORLD_AREAS.map(area => {
                        const position = getAreaPosition(area)
                        const lines = area.name.split(" ")
                        const isSelected = selectedAreaId === area.id
                        const variant = area.element ?? "neutral"

                        return (
                            <g
                                key={area.id}
                                className={`exploration-hex exploration-hex-${variant} ${isSelected ? "is-selected" : ""}`}
                                transform={`translate(${position.x} ${position.y})`}
                                data-area-id={area.id}
                                role="button"
                                tabIndex={0}
                                aria-label={`Select ${area.name}`}
                                aria-pressed={isSelected}
                                onKeyDown={event => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault()
                                        onSelectArea(area.id)
                                    }
                                }}
                            >
                                <polygon points={hexPoints} />
                                <text className="exploration-hex-number" x="0" y={-((lines.length - 1) * 7) - 15}>
                                    Area {area.areaNumber}
                                </text>
                                <text className="exploration-hex-name" x="0" y={-((lines.length - 1) * 7)}>
                                    {lines.map((line, index) => (
                                        <tspan key={line + index} x="0" dy={index === 0 ? 0 : 14}>
                                            {line}
                                        </tspan>
                                    ))}
                                </text>
                            </g>
                        )
                    })}
                </g>
            </svg>
            <div className="exploration-map-controls">
                <Button size="small" variant="secondary" onClick={() => zoomBy(1.15)} aria-label="Zoom in">+</Button>
                <Button size="small" variant="secondary" onClick={() => zoomBy(0.87)} aria-label="Zoom out">−</Button>
                <Button size="small" variant="secondary" onClick={resetView}>Reset</Button>
            </div>
            <Text size="small" className="exploration-map-hint">
                Drag to pan · Scroll or use + / − to zoom · {Math.round(view.scale * 100)}%
            </Text>
        </div>
    )
}

function ExplorationActionCard({ area }) {
    const action = EXPLORATION_CONFIG.actions.find(entry => entry.areaId === area.id)
    const resourceRewards = action?.produces ?? []
    const container = action?.companionContainer

    return (
        <Paper layer={1} variant={area.element ?? "exploration"} className="exploration-action-card">
            <Flex direction="column" align="stretch" gap={12}>
                <Flex direction="row" justify="space-between" wrap gap={8}>
                    <Heading h="2">{action?.name ?? area.name}</Heading>
                    <Badge variant={area.element ?? "exploration"}>
                        {area.element ? humanize(area.element) : "Neutral"} · Tier {area.tier}
                    </Badge>
                </Flex>
                <Text>{area.description}</Text>
                <Flex direction="column" align="stretch" gap={6}>
                    <Heading h="4">Exploration Rewards</Heading>
                    {resourceRewards.length > 0 ? (
                        <Flex direction="row" wrap gap={8}>
                            {resourceRewards.map(reward => (
                                <Badge key={reward.item} variant={area.element ?? "exploration"}>
                                    +{reward.amount.toLocaleString()} {humanize(reward.item.replace(/^item:/, ""))}
                                </Badge>
                            ))}
                        </Flex>
                    ) : (
                        <Text size="small">No resource rewards configured.</Text>
                    )}
                </Flex>
                {container && (
                    <Flex direction="column" align="stretch" gap={4}>
                        <Heading h="4">Companion Discovery</Heading>
                        <Text size="small">
                            {humanize(container.item.replace(/^item:/, ""))} ·
                            {" "}{((container.baseChance ?? 0) * 100).toLocaleString()}% base chance
                            · Unveiling Level {container.minimumUnveilingSkillLevel ?? 1} required
                        </Text>
                    </Flex>
                )}
                {action?.artifactItem && (
                    <Flex direction="column" align="stretch" gap={4}>
                        <Heading h="4">Combat Artifact</Heading>
                        <Text size="small">{humanize(action.artifactItem.replace(/^item:/, ""))}</Text>
                    </Flex>
                )}
                <Text size="small" className="exploration-action-id">
                    {action?.id ?? area.actionId}
                </Text>
            </Flex>
        </Paper>
    )
}

export function ExplorationPage() {
    const [selectedAreaId, setSelectedAreaId] = useState(WORLD_DATA.map.startingAreaId)
    const selectedArea = WORLD_AREA_BY_ID[selectedAreaId] ?? WORLD_AREAS[0]

    return (
        <Flex direction="column" className="page-flex page-flex-exploration" padding={32} gap={24}>
            <Paper layer={0}>
                <SkillSummary
                    title="Exploration"
                    variant="exploration"
                    progressEnabled={false}
                    icon={
                        <Icon size={64} variant="exploration" outerRunes="solid" outerShape={3}
                            innerRunes="gap" innerShape={5}>
                            {cloneElement(SKILL_ICONS.EXPLORATION, { size: 48 })}
                        </Icon>
                    }
                />
            </Paper>

            <Paper layer={0} className="exploration-map-panel">
                <Flex direction="column" align="stretch" gap={8}>
                    <Heading h="2">The Known World</Heading>
                    <ExplorationMap
                        selectedAreaId={selectedArea.id}
                        onSelectArea={setSelectedAreaId}
                    />
                </Flex>
            </Paper>

            <ExplorationActionCard area={selectedArea} />
        </Flex>
    )
}
