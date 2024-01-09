import { Aside } from "@mantine/core"
import { forwardRef } from "react"

export default forwardRef(function (props: any) {

    return (
        <Aside.Section
            {...props}
            grow={props.grow}
        >
            {props.children}
        </Aside.Section>
    )
})