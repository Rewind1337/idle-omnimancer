import '../Modal.scss'

import { Modal } from '../Modal'
import { Heading } from '../Heading'
import { Flex } from '../Flex'

export function BagModal({
    visible,
    setVisible,
    closeBagButton
}) {
    return (
        <Modal
            visible={visible}
            variant="transmutation"
            onBackdropClick={() => { setVisible(false) }}
            header={<Heading h='1'>Bag Modal</Heading>}
            footer={closeBagButton}
            content={<Flex direction="column">
                Clicking outside of the Modal closes the Modal
                {closeBagButton}
            </Flex>}
        />
    )
}