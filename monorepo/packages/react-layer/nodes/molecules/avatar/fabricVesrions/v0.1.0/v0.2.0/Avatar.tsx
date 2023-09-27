import { Avatar } from "@mantine/core"
import { forwardRef } from "react"

export default forwardRef(function (props: any) {

    return (
        <Avatar {...props} variant={props.avatarVariant}>
            {props.children}
        </Avatar>
    )
})