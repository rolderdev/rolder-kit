import { Badge } from "@mantine/core"
import { forwardRef } from "react"
import useScope from "../../../../../../../libs/scopes/useScope/v0.1.0/useScope"
import getCompProps from "../../../../../../../libs/nodesFabric/v0.1.0/getCompProps/v0.1.0/getCompProps"
import { CompProps } from "./types"

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