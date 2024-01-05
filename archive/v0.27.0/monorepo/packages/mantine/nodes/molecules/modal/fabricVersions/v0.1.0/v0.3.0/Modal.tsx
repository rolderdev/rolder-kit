import { Modal, Title } from "@mantine/core"
import { forwardRef, useImperativeHandle } from "react"
import { sendSignal } from "../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { useDisclosure } from "@mantine/hooks"

export default forwardRef(function (props: any, ref) {
    const [opened, { open, close }] = useDisclosure(false)
    useImperativeHandle(ref, () => ({ open() { open() }, close() { close() }, }), [])

    return <Modal.Root
        centered
        size={props.sizeUnits || props.sizePresets}
        opened={opened}
        onClose={() => {
            close()
            sendSignal(props.noodlNode, 'closed')
        }}
        {...props}
        {...props.customProps}
    >
        <Modal.Overlay opacity={props.modalOpacity} blur={props.modalBlur} />
        <Modal.Content>
            {props.modalHeaderEnabled && <Modal.Header>
                {props.modalTitle && <Modal.Title><Title order={props.modalTitleOrder}>{props.modalTitle}</Title></Modal.Title>}
                {props.closeActionEnabled && <Modal.CloseButton />}
            </Modal.Header>}
            <Modal.Body>{props.children}</Modal.Body>
        </Modal.Content>
    </Modal.Root>
})