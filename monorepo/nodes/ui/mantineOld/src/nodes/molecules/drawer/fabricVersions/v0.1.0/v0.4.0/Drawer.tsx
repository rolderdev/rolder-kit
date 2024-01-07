import { Drawer, Title } from "@mantine/core"
import { forwardRef, useImperativeHandle } from "react"
import { sendSignal } from "../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { useDisclosure } from "@mantine/hooks"

export default forwardRef(function (props: any, ref) {
    const [opened, { open, close }] = useDisclosure(false)
    useImperativeHandle(ref, () => ({ open() { open() }, close() { close() }, }), [])

    return <Drawer.Root
        centered
        size={props.sizeUnits || props.sizePresets}
        position={props.drawerPosition}
        opened={opened}
        onClose={() => {
            close()
            sendSignal(props.noodlNode, 'closed')
        }}
        {...props}
    >
        <Drawer.Overlay opacity={props.drawerOpacity} blur={props.drawerBlur} />
        <Drawer.Content>
            {props.drawerHeaderEnabled && <Drawer.Header>
                {props.drawerTitle && <Drawer.Title><Title order={props.drawerTitleOrder}>{props.drawerTitle}</Title></Drawer.Title>}
                {props.closeActionEnabled && <Drawer.CloseButton />}
            </Drawer.Header>}
            <Drawer.Body>{props.children}</Drawer.Body>
        </Drawer.Content>
    </Drawer.Root>
})