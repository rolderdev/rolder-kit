import { forwardRef } from "react"
import { Props } from "./types"
import React from "react"
import { Flex } from "@mantine/core"

export default forwardRef(function (props: Props) {

    return <Flex
        justify={props.flexJustify}
        align={props.flexAlign}
        direction={props.flexDirection}
        wrap={props.flexWrap}
        {...props}
        {...props.customProps}
    >
        {props.children}
    </Flex>
})