import {
    useCallback,
    useMemo,
    useRef,
    useState
} from 'react'

import { ToastContext } from './ToastContext'
import { TOAST_TYPES } from '../data/toastTypes'
import { ToastContainer } from '../components/ToastContainer'

export function ToastProvider({
    children,
    maxToasts = 7
}) {
    const [toasts, setToasts] = useState([])
    const nextId = useRef(0)

    const toastLimit = Math.max(1, Math.floor(maxToasts))

    // Create a new notification and return its ID.
    const showToast = useCallback(({
        title = null,
        message,
        type = 'info',
        duration = 5000,
        action = null
    } = {}) => {
        if (message === undefined || message === null || message === '') {
            throw new Error('showToast requires a message.')
        }

        const normalizedType = Object.prototype.hasOwnProperty.call(TOAST_TYPES, type)
            ? type
            : 'info'

        const numericDuration = Number(duration)

        const id = `toast-${++nextId.current}`

        const toast = {
            id,
            title,
            message,
            type: normalizedType,
            duration: Number.isFinite(numericDuration)
                ? Math.max(0, numericDuration)
                : 5000,
            action
        }

        setToasts(current => [
            ...current,
            toast
        ].slice(-toastLimit))

        return id
    }, [toastLimit])

    // Dismiss one notification.
    const dismissToast = useCallback((id) => {
        setToasts(current =>
            current.filter(toast => toast.id !== id)
        )
    }, [])

    // Dismiss every notification.
    const clearToasts = useCallback(() => {
        setToasts([])
    }, [])

    const contextValue = useMemo(() => ({
        showToast,
        dismissToast,
        clearToasts
    }), [showToast, dismissToast, clearToasts])

    return (
        <ToastContext.Provider value={contextValue}>
            {children}

            <ToastContainer
                toasts={toasts}
                onDismiss={dismissToast}
            />
        </ToastContext.Provider>
    )
}