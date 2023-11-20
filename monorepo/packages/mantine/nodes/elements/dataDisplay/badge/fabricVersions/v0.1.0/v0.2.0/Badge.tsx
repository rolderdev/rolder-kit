import { Badge } from "@mantine/core"
import { forwardRef } from "react"

export default forwardRef(function (props: any) {

    return <Badge
        variant={props.badgeVariant}
        {...props}
        {...props.customProps}
    >
        {props.label}
    </Badge>
})