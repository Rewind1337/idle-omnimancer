import { useEffect, useRef } from 'react'
import {
    CheckCircle,
    Info,
    AlertTriangle,
    XCircle,
    Sparkles,
    CircleDot,
    BookOpen,
    WandSparkles,
    FlaskConical,
    Compass,
    Eye,
    Swords,
    Mountain,
    Wind,
    Droplet,
    X
} from 'lucide-react'

import { Paper } from './Paper'
import { Flex } from './Flex'
import { Button } from './Button'
import { Heading } from './Heading'
import { Text } from './Text'

// Notification types, their icons and their corresponding color variants.
export const TOAST_TYPES = {
    success: { icon: CheckCircle, variant: 'exploration' },
    info: { icon: Info, variant: 'water' },
    warning: { icon: AlertTriangle, variant: 'spellcraft' },
    error: { icon: XCircle, variant: 'combat' },

    primary: { icon: Sparkles, variant: 'primary' },
    secondary: { icon: CircleDot, variant: 'secondary' },

    research: { icon: BookOpen, variant: 'research' },
    spellcraft: { icon: WandSparkles, variant: 'spellcraft' },
    transmutation: { icon: FlaskConical, variant: 'transmutation' },
    exploration: { icon: Compass, variant: 'exploration' },
    unveiling: { icon: Eye, variant: 'unveiling' },
    combat: { icon: Swords, variant: 'combat' },

    earth: { icon: Mountain, variant: 'earth' },
    air: { icon: Wind, variant: 'air' },
    water: { icon: Droplet, variant: 'water' }
}

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
    const Icon = config.icon
    const variant = config.variant

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
            layer={2}
            variant={variant}
            padding={12}
            className={`toast toast-${type}`}
            role={type === 'error' ? 'alert' : 'status'}
            aria-live={type === 'error' ? 'assertive' : 'polite'}
            aria-atomic="true"
            onMouseEnter={pauseTimer}
            onMouseLeave={resumeTimer}
        >
            <Flex gap={8} align="flex-start" className="toast-layout">
                <Icon size={22} aria-hidden="true" />

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
                    icon={<X size={16} />}
                    onClick={() => onDismiss?.(id)}
                    className="toast-dismiss"
                    aria-label="Dismiss notification"
                />
            </Flex>
        </Paper>
    )
}