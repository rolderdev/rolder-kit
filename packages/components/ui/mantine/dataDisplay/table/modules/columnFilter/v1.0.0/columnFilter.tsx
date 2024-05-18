import { sendOutput } from "@packages/port-send"
import { forwardRef, useImperativeHandle } from "react"
import type { Props } from "./types"
import React from "react"
import { useTableScope } from "@packages/scope"
import isEmpty from "@packages/is-empty"

function getEmptyType(value: any) {
    switch (typeof value) {
        case 'boolean': return false
        case 'number': return 0
        case 'object': {
            if (Array.isArray(value)) return []
            else return {}
        }
        case 'string': return ''
    }
}

export default forwardRef(function (props: Props, ref) {
    const { table2ColumnIndex, table2FilterValue } = props
    const { setFilterValue, setFilterState, resetFilterValue, getColumnFilter } = useTableScope(props.innerProps?.tableId)

    Noodl.Events.on(`resetTableFilters-${props.innerProps?.tableId}`, () => {
        sendOutput(props.noodlNode, 'table2FilterValue', getEmptyType(getColumnFilter(table2ColumnIndex)?.value))
        resetFilterValue(table2ColumnIndex)
        setFilterState(table2ColumnIndex, false)
        props.innerProps?.forceUpdate()
    })

    useImperativeHandle(ref, () => ({
        table2SetFilterValue() {
            sendOutput(props.noodlNode, 'table2FilterValue',
                !isEmpty(table2FilterValue) ? table2FilterValue : getEmptyType(getColumnFilter(table2ColumnIndex)?.value))
            setFilterValue(table2ColumnIndex, !isEmpty(table2FilterValue) ? table2FilterValue : undefined)
        },
        table2Filter() {
            setFilterState(table2ColumnIndex, !isEmpty(getColumnFilter(table2ColumnIndex)?.value))
            props.innerProps?.forceUpdate()
        },
        close() { props.innerProps?.close() },
        reset() {
            sendOutput(props.noodlNode, 'table2FilterValue', getEmptyType(getColumnFilter(table2ColumnIndex)?.value))
            resetFilterValue(table2ColumnIndex)
            setFilterState(table2ColumnIndex, false)
            props.innerProps?.forceUpdate()
        },
    }), [props])

    return <>{props.children}</>
})