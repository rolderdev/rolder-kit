import { forwardRef } from "react"
import { sendOutput } from "../../../../../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"

export default forwardRef(function (props: any) {
    if (props.tableItem) {
        sendOutput(props.noodlNode, 'tableItem', props.tableItem)
        return props.children
    } else return null
})