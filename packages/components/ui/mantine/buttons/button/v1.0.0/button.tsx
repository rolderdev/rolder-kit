import { forwardRef } from "react"
import type { Props } from "./types"
import { getCompProps } from '@packages/get-comp-props'
import { useTableCellScope } from "@packages/scope"
import { Button } from "@mantine/core"
import convertColor from "@packages/convert-color"
import { sendSignal } from "@packages/port-send"

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
