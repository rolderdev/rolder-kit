import { forwardRef, useImperativeHandle } from "react"
import type { Props } from "./types";;
import { useDisclosure } from "@mantine/hooks"
import { Drawer, Title } from "@mantine/core";
import { sendSignal } from "@packages/port-send"

export default forwardRef(function (props: Props, ref) {
    const [opened, { open, close }] = useDisclosure(false)
    useImperativeHandle(ref, () => ({ open() { open() }, close() { close() }, }), [])

    return <Drawer.Root
        size={props.sizeUnits || props.sizePresets}
        position={props.drawerPosition}
        opened={opened}
        onClose={() => {
            close()
            sendSignal(props.noodlNode, 'closed')
        }}
        {...props}
        {...props.customProps}
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
