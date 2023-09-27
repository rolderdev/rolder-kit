import { Box } from "@mantine/core"
import { forwardRef } from "react"

export default forwardRef(function (props: any) {

    return (
        <Box
            sx={...props.style}
            {...props}
        >
            {props.children}
        </Box>
    )
})