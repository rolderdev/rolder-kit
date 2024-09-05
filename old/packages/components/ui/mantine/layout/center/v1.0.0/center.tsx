import { forwardRef } from "react"
import type { Props } from "./types";;
import { Center } from "@mantine/core";

export default forwardRef(function (props: Props) {

    return <Center
        {...props}
        {...props.customProps}
    >
        {props.children}
    </Center>
})
