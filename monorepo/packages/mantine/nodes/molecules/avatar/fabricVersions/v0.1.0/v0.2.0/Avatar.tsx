import { Avatar } from "@mantine/core"
import { forwardRef } from "react"

export default forwardRef(function (props: any) {

    return (
        <Avatar        
            variant={props.avatarVariant}
            {...props}
            {...props.customProps}
        >
            {props.children}
        </Avatar>
    )
})