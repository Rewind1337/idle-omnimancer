import { Modal } from "../Modal"
import { Heading } from "../Heading"
import { Button } from "../Button"

export function MissionsModal({ visible, setVisible }) {
    const close = () => setVisible(false)

    return (
        <Modal
            visible={visible}
            variant="primary"
            onBackdropClick={close}
            header={<Heading h="1">Missions</Heading>}
            content={null}
            footer={
                <Button variant="primary" onClick={close}>
                    Close
                </Button>
            }
        />
    )
}
