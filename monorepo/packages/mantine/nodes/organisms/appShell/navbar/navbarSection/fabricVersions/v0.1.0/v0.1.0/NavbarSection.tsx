import { Navbar } from "@mantine/core"
import { forwardRef } from "react"

export default forwardRef(function (props: any) {

    return (
        <Navbar.Section
            {...props}
            grow={props.grow}
        >
            {props.children}
        </Navbar.Section>
    )
})