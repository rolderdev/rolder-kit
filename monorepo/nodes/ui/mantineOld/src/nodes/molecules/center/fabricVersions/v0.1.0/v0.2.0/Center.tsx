import { Center } from "@mantine/core"
import { forwardRef } from "react"

export default forwardRef(function (props: any) {

    return <Center
        {...props}
        {...props.customProps}>
        {props.children}
    </Center>
})