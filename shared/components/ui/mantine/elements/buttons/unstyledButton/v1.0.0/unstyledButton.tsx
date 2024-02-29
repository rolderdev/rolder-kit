import { forwardRef } from "react"
import { Props } from "./types"
import { getCompProps } from '@shared/get-comp-props'
import { useTableCellScope } from "@shared/scope"
import { UnstyledButton } from "@mantine/core"
import { sendSignal } from "@shared/port-send"
import React from "react"

export default forwardRef(function (props: Props) {
    const item = useTableCellScope()
    const p = { ...getCompProps(props, item) } as Props

    return <UnstyledButton
        onClick={(e) => {
            e.stopPropagation()
            sendSignal(props.noodlNode, 'clicked')
        }}
        {...p}
        {...p.customProps}
    >
        {p.children}
    </UnstyledButton>
})