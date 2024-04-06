import { Box } from "@mantine/core"
import { forwardRef } from "react"

export default forwardRef(function (props: any) {

    return (
        <Box
            {...props}
            {...props.customProps}            
        >
            {props.children}
        </Box>
    )
})