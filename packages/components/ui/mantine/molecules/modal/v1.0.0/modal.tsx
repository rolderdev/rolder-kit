import { forwardRef, useImperativeHandle } from "react"
import type { Props } from "./types";
import React from "react";
import { useDisclosure } from "@mantine/hooks"
import { Modal, Title } from "@mantine/core";
import { sendSignal } from "@packages/port-send"

export default forwardRef(function (props: Props, ref) {
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