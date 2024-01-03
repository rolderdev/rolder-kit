import { Paper } from "@mantine/core"
import { forwardRef } from "react"

export default forwardRef(function (props: any) {

    return <Paper
        {...props}
        {...props.customProps}>
        {props.children}
    </Paper>
})