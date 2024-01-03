import { Flex } from "@mantine/core"
import { forwardRef } from "react"

export default forwardRef(function (props: any) {

    return <Flex
        justify={props.flexJustify}
        align={props.flexAlign}
        direction={props.flexDirection}
        wrap={props.flexWrap}
        {...props}
        {...props.customProps}>
        {props.children}
    </Flex>
})