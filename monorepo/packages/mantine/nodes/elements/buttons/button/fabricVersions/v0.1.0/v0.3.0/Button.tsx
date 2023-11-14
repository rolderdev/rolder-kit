import { Button } from "@mantine/core"
import { forwardRef } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { sendSignal } from "../../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"

export default forwardRef(function (props: any) {
    const Icon = icons(props.iconName)

    return <Button
        type={props.buttonType}
        variant={props.buttonVariant}
        leftIcon={Icon && <Icon size={props.iconSize} stroke={props.stroke} />}
        onClick={() => sendSignal(props.noodlNode, 'clicked')}
        {...props}
        {...props.customProps}
    >
        {props.label}
    </Button>
})