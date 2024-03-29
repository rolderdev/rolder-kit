import { forwardRef, useImperativeHandle } from "react"
import { sendOutput } from "../../../../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"

export default forwardRef(function (props: any, ref) {
    useImperativeHandle(ref, () => ({
        table2SetFilterValue() {
            sendOutput(props.noodlNode, 'table2FilterValue', props.table2FilterValue)
            props.setFilterState(props.table2ColumnIndex, props.table2FilterValue)
            props.forceUpdate()
        },
        table2Filter() {
            sendOutput(props.noodlNode, 'table2FilterValue', props.table2FilterValue)
            props.setFilterValue(props.table2ColumnIndex, props.table2FilterValue)
            props.setFilterState(props.table2ColumnIndex, props.table2FilterValue)
            props.forceUpdate()
        },
        close() { props.close() },
        reset() {
            sendOutput(props.noodlNode, 'table2FilterValue', null)
            props.setFilterValue(props.table2ColumnIndex)
            props.setFilterState(props.table2ColumnIndex)
            props.forceUpdate()
        },
    }), [props])

    return props.children
})