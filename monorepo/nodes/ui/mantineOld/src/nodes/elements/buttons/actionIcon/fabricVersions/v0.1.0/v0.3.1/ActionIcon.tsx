import { ActionIcon } from "@mantine/core"
import { forwardRef } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { sendSignal } from "../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"

export default forwardRef(function (props: any) {
    const Icon = props.iconName ? icons(props.iconName) : icons('IconGhostFilled')

    return <ActionIcon
        onClick={(e) => {
            e.stopPropagation()
            sendSignal(props.noodlNode, 'clicked')
        }}
        variant={props.actionIconVariant}
        {...props}
        {...props.customProps}
    >
        <Icon
            size={props.iconSize}
            stroke={props.stroke}
        />
    </ActionIcon>
})