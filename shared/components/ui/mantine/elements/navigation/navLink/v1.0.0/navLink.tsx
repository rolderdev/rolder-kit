import { forwardRef } from "react"
import { Props } from "./types"
import React from "react"
import { getCompProps } from '@shared/get-comp-props'
import { useTableCellScope } from "@shared/scope"
import { NavLink } from "@mantine/core"
import convertColor from "@shared/convert-color"
import { sendSignal } from "@shared/port-send"

export default forwardRef(function (props: Props) {
    const item = useTableCellScope()
    const p = { ...getCompProps(props, item) } as Props

    const Icon = p.iconName && R.libs.icons[p.iconName]

    const navLinkProps = { ...p }
    navLinkProps.active = p.active || p.label === p.activateLabel

    return <NavLink
        key={p.label}
        variant={p.navLinkVariant}
        icon={Icon && <Icon size={p.iconSize} stroke={p.iconStroke} color={convertColor(p.iconColor)} />}
        onClick={(e) => {
            e.stopPropagation()
            sendSignal(props.noodlNode, 'clicked')
        }}
        {...navLinkProps}
        {...navLinkProps.customProps}
    />
})
