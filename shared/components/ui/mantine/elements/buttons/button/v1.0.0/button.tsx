import { forwardRef } from "react"
import { Props } from "./types"
import React from "react"
import { getCompProps } from '@shared/get-comp-props'
import { useTableCellScope } from "@shared/scope"
import { Button } from "@mantine/core"
import convertColor from "@shared/convert-color"
import { sendSignal } from "@shared/port-send"

export default forwardRef(function (props: Props, ref: any) {
    const item = useTableCellScope()
    const p = { ...getCompProps(props, item) } as Props

    const Icon = p.iconName && R.libs.icons[p.iconName]

    return <Button
        type={p.buttonType}
        variant={p.buttonVariant}
        leftIcon={Icon && <Icon size={p.iconSize} stroke={p.iconStroke} color={convertColor(p.iconColor)} />}
        onClick={(e) => {
            e.stopPropagation()
            sendSignal(props.noodlNode, 'clicked')
        }}
        ref={ref}
        {...p}
        {...p.customProps}
    >
        {p.label}
    </Button>
})