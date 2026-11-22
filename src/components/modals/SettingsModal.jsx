import { useState } from "react"
import { Button } from "../Button"
import { Flex } from "../Flex"
import { Heading } from "../Heading"
import { Modal } from "../Modal"
import { Paper } from "../Paper"
import { Text } from "../Text"

import "./SettingsModal.scss"

function SettingOptions({ title, description, value, options, onChange }) {
    return (
        <Paper layer={2} variant="secondary">
            <Flex direction="column" align="stretch" gap={8}>
                <Heading h="3">{title}</Heading>
                {description && <Text size="small">{description}</Text>}
                <Flex direction="row" wrap gap={8} className="settings-option-buttons">
                    {options.map(option => (
                        <Button
                            key={option.value}
                            variant="primary"
                            checked={value === option.value}
                            className="flex-grow"
                            onClick={() => onChange(option.value)}
                        >
                            {option.label}
                        </Button>
                    ))}
                </Flex>
            </Flex>
        </Paper>
    )
}

export function SettingsModal({
    visible,
    setVisible,
    settings,
    onChange,
    onResetGame,
}) {
    const [confirmingReset, setConfirmingReset] = useState(false)

    if (!visible) return null

    const close = () => {
        setConfirmingReset(false)
        setVisible(false)
    }

    const confirmReset = () => {
        onResetGame?.()
        close()
    }

    return (
        <Modal
            visible={visible}
            variant="secondary"
            className="modal-settings"
            onBackdropClick={close}
            header={<Heading h="1">Settings</Heading>}
            content={
                <Flex direction="column" align="stretch" gap={12}>
                    <SettingOptions
                        title="Sidebar Position"
                        description="Choose whether the main navigation appears above the page or beside it."
                        value={settings.position}
                        options={[
                            { value: "top", label: "Top" },
                            { value: "side", label: "Side" },
                        ]}
                        onChange={value => onChange("position", value)}
                    />
                    <SettingOptions
                        title="Sidebar Mode"
                        description="Compact mode shows only the navigation icons. This setting works independently of the position."
                        value={settings.mode}
                        options={[
                            { value: "default", label: "Default" },
                            { value: "compact", label: "Compact" },
                        ]}
                        onChange={value => onChange("mode", value)}
                    />
                    <Paper layer={2} variant="secondary">
                        <Flex direction="column" align="stretch" gap={8}>
                            <Heading h="3">Reset Progress</Heading>
                            {confirmingReset ? (
                                <Flex direction="column" gap={8}>
                                    <Text size="small">
                                        This permanently deletes your current game progress. Are you sure?
                                    </Text>
                                    <Flex direction="row" wrap gap={8}>
                                        <Button variant="secondary" onClick={() => setConfirmingReset(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="combat" onClick={confirmReset}>
                                            Reset All Progress
                                        </Button>
                                    </Flex>
                                </Flex>
                            ) : (<>
                                <Text size="small">
                                    Erase all progress, permanently.
                                </Text>
                                <Button variant="combat" onClick={() => setConfirmingReset(true)}>
                                    Reset Progress
                                </Button>
                            </>)}
                        </Flex>
                    </Paper>
                </Flex>
            }
            footer={<Button variant="primary" className="w-100" onClick={close}>Close</Button>}
        />
    )
}
