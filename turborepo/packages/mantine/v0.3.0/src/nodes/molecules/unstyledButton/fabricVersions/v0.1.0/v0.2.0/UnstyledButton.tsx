import { UnstyledButton } from "@mantine/core"
import { forwardRef } from "react"
import { sendSignal } from "@rk/node-fabrik"

export default forwardRef(function (props: any) {

    return <UnstyledButton
        onClick={() => sendSignal(props.noodlNode, 'clicked')}
        {...props}
        {...props.customProps}
    >
        {props.children}
    </UnstyledButton>
})