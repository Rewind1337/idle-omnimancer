import { cloneElement, useEffect, useRef } from 'react'

import { OTHER_ICONS } from '../data/iconLibrary'
import { TOAST_TYPES } from '../data/toastTypes'

import { Paper } from './Paper'
import { Flex } from './Flex'
import { Button } from './Button'
import { Heading } from './Heading'
import { Text } from './Text'

import './Toast.scss'

export function Toast({
    id,
    title,
    message,
    type = 'info',
    duration = 5000,
    action = null,
    onDismiss
}) {
    const config = TOAST_TYPES[type] ?? TOAST_TYPES.info
    const variant = config.variant

    const icon = cloneElement(config.icon, {
        size: 24,
        'aria-hidden': true,
    })

    // Keep track of the remaining lifetime so hovering pauses the timer.
    const timerRef = useRef({
        timeoutId: null,
        startedAt: 0,
        remaining: duration
    })

    useEffect(() => {
        const timer = timerRef.current

        timer.remaining = duration

        // A duration of 0 means the toast stays until manually dismissed.
        if (duration <= 0) return

        timer.startedAt = Date.now()
        timer.timeoutId = window.setTimeout(() => {
            timer.timeoutId = null
            onDismiss?.(id)
        }, duration)

        return () => {
            if (timer.timeoutId !== null) {
                window.clearTimeout(timer.timeoutId)
                timer.timeoutId = null
            }
        }
    }, [duration, id, onDismiss])

    // Pause the timer while the toast is hovered.
    const pauseTimer = () => {
        const timer = timerRef.current

        if (timer.timeoutId === null) return

        window.clearTimeout(timer.timeoutId)
        timer.timeoutId = null

        timer.remaining = Math.max(
            0,
            timer.remaining - (Date.now() - timer.startedAt)
        )
    }

    // Resume the timer using its remaining lifetime.
    const resumeTimer = () => {
        const timer = timerRef.current

        if (duration <= 0 || timer.timeoutId !== null) return

        if (timer.remaining <= 0) {
            onDismiss?.(id)
            return
        }

        timer.startedAt = Date.now()
        timer.timeoutId = window.setTimeout(() => {
            timer.timeoutId = null
            onDismiss?.(id)
        }, timer.remaining)
    }

    const handleAction = () => {
        action?.onClick?.()
        onDismiss?.(id)
    }

    return (
        <Paper
            layer={3}
            variant={variant}
            padding={16}
            className={`toast toast-${type}`}
            role={type === 'error' ? 'alert' : 'status'}
            aria-live={type === 'error' ? 'assertive' : 'polite'}
            aria-atomic="true"
            onMouseEnter={pauseTimer}
            onMouseLeave={resumeTimer}
        >
            <Flex gap={8} align="flex-start" className="toast-layout">
                {icon}

                <Flex
                    direction="column"
                    align="stretch"
                    gap={4}
                    className="toast-content"
                >
                    {title && (
                        <Heading h="4" variant={variant}>
                            {title}
                        </Heading>
                    )}

                    <Text size="small" variant={variant}>
                        {message}
                    </Text>

                    {action?.label && (
                        <Button
                            size="small"
                            variant={action.variant ?? variant}
                            onClick={handleAction}
                            className="toast-action"
                        >
                            {action.label}
                        </Button>
                    )}
                </Flex>

                <Button
                    size="small"
                    transparent
                    icon={cloneElement(OTHER_ICONS.CLOSE, { size: 16 })}
                    onClick={() => onDismiss?.(id)}
                    className="toast-dismiss"
                    aria-label="Dismiss notification"
                />
            </Flex>
        </Paper>
    )
}