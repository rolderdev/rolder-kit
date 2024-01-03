import { NavLink } from "@mantine/core"
import { forwardRef } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { sendSignal } from "@rk/node-fabrik"

export default forwardRef(function (props: any) {
    const Icon = icons(props.iconName)

    return (
        <NavLink
            key={props.label}
            {...props}
            variant={props.navLinkVariant}
            active={props.active || props.label === props.activateLabel}
            icon={Icon && <Icon size={props.iconSize} stroke={props.stroke} />}
            onClick={() => sendSignal(props.noodlNode, 'clicked')}
        />
    )
})