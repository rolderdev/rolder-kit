import { forwardRef } from "react"
import type { Props } from "./types";;
import { Avatar } from "@mantine/core";

export default forwardRef(function (props: Props) {

    return <Avatar
        variant={props.avatarVariant}
        {...props}
        {...props.customProps}
    >
        {props.children}
    </Avatar>
})
