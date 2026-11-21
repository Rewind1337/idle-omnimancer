import { useEffect, useMemo, useRef, useState } from "react"

import { Button } from "../Button"
import { Text } from "../Text"

import "./HexMap.scss"

const MAP_CENTER = { x: 400, y: 260 }
const DEFAULT_HEX_SIZE = 65
const MIN_ZOOM = 0.65
const MAX_ZOOM = 1.8

const clampZoom = scale => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, scale))

const getAreaPosition = (area, hexSize) => ({
    x: hexSize * Math.sqrt(3) * (area.position.q + area.position.r / 2),
    y: hexSize * 1.5 * area.position.r,
})

const getHexPoints = hexSize => Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI / 3) * index - Math.PI / 2
    return `${Math.cos(angle) * hexSize},${Math.sin(angle) * hexSize}`
}).join(" ")

const getConnectionLines = (areas, areaById, hexSize) => {
    const seenConnections = new Set()

    return areas.flatMap(area => (area.connections ?? []).flatMap(connectionId => {
        const connectedArea = areaById[connectionId]
        if (!connectedArea) return []

        const key = [area.id, connectedArea.id].sort().join("::")
        if (seenConnections.has(key)) return []
        seenConnections.add(key)

        return [{
            id: key,
            start: getAreaPosition(area, hexSize),
            end: getAreaPosition(connectedArea, hexSize),
        }]
    }))
}

/**
 * Reusable axial hex map. The owning page supplies its areas, selected tile,
 * and per-area levels; the component only handles map rendering and navigation.
 */
export function HexMap({
    areas = [],
    startingAreaId = null,
    selectedAreaId = null,
    onSelectArea = () => {},
    actionLevels = {},
    hexSize = DEFAULT_HEX_SIZE,
    className = "",
    ariaLabel = "Hex map. Drag to pan and scroll to zoom.",
}) {
    const [view, setView] = useState({ x: 0, y: 0, scale: 1 })
    const [isDragging, setIsDragging] = useState(false)
    const dragRef = useRef(null)
    const mapRef = useRef(null)

    const areaById = useMemo(
        () => Object.fromEntries(areas.map(area => [area.id, area])),
        [areas]
    )
    const hexPoints = useMemo(() => getHexPoints(hexSize), [hexSize])
    const connectionLines = useMemo(
        () => getConnectionLines(areas, areaById, hexSize),
        [areas, areaById, hexSize]
    )

    const startingArea = areaById[startingAreaId] ?? areas[0] ?? null
    const startingPosition = startingArea
        ? getAreaPosition(startingArea, hexSize)
        : { x: 0, y: 0 }

    // Listen natively with passive:false so wheel zoom always prevents the page
    // (and its parent scroll area) from scrolling while the pointer is on the map.
    useEffect(() => {
        const mapElement = mapRef.current
        if (!mapElement) return undefined

        const handleWheel = event => {
            event.preventDefault()
            event.stopPropagation()

            const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9
            setView(current => ({
                ...current,
                scale: clampZoom(current.scale * zoomFactor),
            }))
        }

        mapElement.addEventListener("wheel", handleWheel, { passive: false })
        return () => mapElement.removeEventListener("wheel", handleWheel)
    }, [])

    const stopDragging = () => {
        const drag = dragRef.current
        if (!drag) return

        dragRef.current = null
        setIsDragging(false)

        if (!drag.moved && drag.areaId) onSelectArea(drag.areaId)
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
        const drag = dragRef.current
        if (!drag) return

        const deltaX = event.clientX - drag.startX
        const deltaY = event.clientY - drag.startY
        if (Math.abs(deltaX) + Math.abs(deltaY) > 4) {
            drag.moved = true
            setIsDragging(true)
        }

        if (drag.moved) {
            const nextX = drag.viewX + deltaX
            const nextY = drag.viewY + deltaY
            setView(current => ({ ...current, x: nextX, y: nextY }))
        }
    }

    const cancelDragging = () => {
        dragRef.current = null
        setIsDragging(false)
    }

    const zoomBy = factor => {
        setView(current => ({
            ...current,
            scale: clampZoom(current.scale * factor),
        }))
    }

    const resetView = () => setView({ x: 0, y: 0, scale: 1 })

    return (
        <div
            ref={mapRef}
            className={`hex-map ${isDragging ? "is-dragging" : ""} ${className}`.trim()}
        >
            <svg
                className="hex-map-svg"
                viewBox="0 0 800 520"
                role="group"
                aria-label={ariaLabel}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={stopDragging}
                onPointerCancel={cancelDragging}
                onLostPointerCapture={cancelDragging}
            >
                <g transform={`translate(${MAP_CENTER.x + view.x - startingPosition.x * view.scale} ${MAP_CENTER.y + view.y - startingPosition.y * view.scale}) scale(${view.scale})`}>
                    <g className="hex-map-connections">
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
                    {areas.map(area => {
                        const position = getAreaPosition(area, hexSize)
                        const lines = area.name.split(" ")
                        const isSelected = selectedAreaId === area.id
                        const variant = area.element ?? "neutral"
                        const actionLevel = actionLevels[area.id] ?? actionLevels[area.actionId] ?? 1
                        const numberY = -((lines.length - 1) * 7) - 15
                        const nameY = -((lines.length - 1) * 7)

                        return (
                            <g
                                key={area.id}
                                className={`hex-map-area hex-map-area-${variant} ${isSelected ? "is-selected" : ""}`}
                                transform={`translate(${position.x} ${position.y})`}
                                data-area-id={area.id}
                                role="button"
                                tabIndex={0}
                                aria-label={`Select ${area.name}, Action Level ${actionLevel}`}
                                aria-pressed={isSelected}
                                onKeyDown={event => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault()
                                        onSelectArea(area.id)
                                    }
                                }}
                            >
                                <polygon points={hexPoints} />
                                <text className="hex-map-area-number" x="0" y={numberY}>
                                    Area {area.areaNumber}
                                </text>
                                <text className="hex-map-area-name" x="0" y={nameY}>
                                    {lines.map((line, index) => (
                                        <tspan key={line + index} x="0" dy={index === 0 ? 0 : 14}>
                                            {line}
                                        </tspan>
                                    ))}
                                </text>
                                <text className="hex-map-area-level" x="0" y="39">
                                    Lv. {actionLevel}
                                </text>
                            </g>
                        )
                    })}
                </g>
            </svg>

            <div className="hex-map-controls">
                <Button size="small" variant="secondary" onClick={() => zoomBy(1.15)} aria-label="Zoom in">+</Button>
                <Button size="small" variant="secondary" onClick={() => zoomBy(0.87)} aria-label="Zoom out">−</Button>
                <Button size="small" variant="secondary" onClick={resetView}>Reset</Button>
            </div>

            <Text size="small" className="hex-map-hint">
                Drag to pan · Scroll or use + / − to zoom · {Math.round(view.scale * 100)}%
            </Text>
        </div>
    )
}
