import '../Modal.scss'

import { Modal } from '../Modal'
import { Heading } from '../Heading'
import { Flex } from '../Flex'

export function BadgeInfoModal({
    title,
    visible,
    setVisible,
}) {
    return (
        <Modal
            visible={visible}
            variant={null}
            onBackdropClick={() => { setVisible(false) }}
            header={<Heading h="1">{title}</Heading>}
            content={
                <Flex direction="column" gap={16}>

                </Flex>
            }
        />
    )
}
