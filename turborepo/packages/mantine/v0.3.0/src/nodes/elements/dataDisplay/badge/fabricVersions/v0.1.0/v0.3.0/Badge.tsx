import { Badge } from "@mantine/core"
import { forwardRef } from "react"
import useScope from "../../../../../../../libs/scopes/useScope/v0.1.0/useScope"
import { CompProps } from "./types"
import { getCompProps } from '@rk/node-fabrik'

export default forwardRef(function (props: CompProps) {
    const scope = useScope(props.scope, 'v0.1.0')
    const item = props.useScope && scope ? scope.item.get() : undefined
    const p = { ...getCompProps(props, item) } as CompProps

    return <Badge
        variant={p.badgeVariant}
        {...p}
        {...p.customProps}
    >
        {p.label}
    </Badge>
})