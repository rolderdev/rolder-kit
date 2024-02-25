import { UnstyledButton } from "@mantine/core"
import { forwardRef } from "react"
import { sendSignal } from "../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"

export default forwardRef(function (props: any) {

    return <UnstyledButton
        onClick={() => sendSignal(props.noodlNode, 'clicked')}
        {...props}
        {...props.customProps}
    >
        {props.children}
    </UnstyledButton>
})