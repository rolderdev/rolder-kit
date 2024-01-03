import { ActionIcon } from "@mantine/core"
import { forwardRef } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { sendSignal } from "@rk/node-fabrik"

export default forwardRef(function (props: any) {
    const Icon = props.iconName ? icons(props.iconName) : icons('IconGhostFilled')

    return <ActionIcon
        onClick={() => sendSignal(props.noodlNode, 'clicked')}
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