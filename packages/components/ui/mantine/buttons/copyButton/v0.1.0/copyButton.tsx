import { forwardRef } from "react"
import type { Props } from "./types"
import React from "react"
import { getCompProps } from '@packages/get-comp-props'
import { useTableCellScope } from "@packages/scope"
import { Button, CopyButton } from "@mantine/core"
import convertColor from "@packages/convert-color"
import { sendSignal } from "@packages/port-send"

export default forwardRef(function (props: Props) {
    const item = useTableCellScope()
    const p = { ...getCompProps(props, item) } as Props

    const Icon = p.iconName && R.libs.icons[p.iconName]

    return <CopyButton value={p.copyValue} {...p} {...p.customProps}>
        {({ copied, copy }) => (
            <Button
                type={p.buttonType}
                variant={p.buttonVariant}
                leftIcon={Icon && <Icon size={p.iconSize} stroke={p.iconStroke} color={convertColor(p.iconColor)} />}
                onClick={(e) => {
                    copy()
                    e.stopPropagation()
                    sendSignal(props.noodlNode, 'clicked')
                }}
                {...p}
                color={copied ? p.copiedColor : p.color}
                {...p.customProps}
            >
                {copied ? p.copiedLabel : p.label}
            </Button>
        )}
    </CopyButton>

})
