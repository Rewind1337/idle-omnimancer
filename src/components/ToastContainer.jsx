import { createPortal } from 'react-dom'

import { Flex } from './Flex'
import { Toast } from './Toast'

import './Toast.scss'

export function ToastContainer({
    toasts = [],
    onDismiss
}) {
    if (typeof document === 'undefined') return null

    return createPortal(
        <Flex
            direction="column"
            align="center"
            gap={8}
            className="toast-container"
            role="region"
            aria-label="Notifications"
        >
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onDismiss={onDismiss}
                />
            ))}
        </Flex>,
        document.body
    )
}