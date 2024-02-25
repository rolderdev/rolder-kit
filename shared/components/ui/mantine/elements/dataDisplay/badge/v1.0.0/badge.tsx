import { Badge } from "@mantine/core"
import { forwardRef } from "react"
import { Props } from "./types"
import React from "react"
import { getCompProps } from "@shared/get-comp-props"
import { useTableCellScope } from "@shared/scope"

export default forwardRef(function (props: Props) {
    const item = useTableCellScope()

    const p = { ...getCompProps(props, item) } as Props

    return <Badge
        variant={p.badgeVariant}
        {...p}
        {...p.customProps}
    >
        {p.label}
    </Badge>
})
