import { Group } from "@mantine/core"
import { forwardRef } from "react"

export default forwardRef(function (props: any) {

    return <Group
        position={props.groupPosition}
        spacing={props.groupSpacing}
        {...props}
        {...props.customProps}>
        {props.children}
    </Group>
})