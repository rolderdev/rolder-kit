import { forwardRef, useState } from "react"
import { useShallowEffect } from "@mantine/hooks"
import { sendOutput, sendSignal } from "../../../../../../../../../libs/nodesFabric/v0.1.0/send/v0.4.0/send"
import { SegmentedControl } from "@mantine/core"
import converForSelectInputs from '../../../../../../../utils/converForSelectInputs/v0.2.0/converForSelectInputs'

export default forwardRef(function (props: any) {
    const { getValue } = window.R.utils

    const [data, setData] = useState([])
    useShallowEffect(() => {
        const items = props.inputItems
        if (props.labelField && items?.some((i: any) => getValue.v7(i, props.labelField)))
            setData(items.map((i: any) => converForSelectInputs(i, props.labelField)))
    }, [props])

    const [value, setValue] = useState<string | null>(null);
    useShallowEffect(() => {
        if (props.inputItems) {
            const selectedItem = props.inputItems.find((i: any) => value && [i.value, i.id, i.label].includes(value))
            sendOutput(props.noodlNode, 'selectedItem', selectedItem || null)
            sendSignal(props.noodlNode, 'selected')
        }
    }, [value])

    useShallowEffect(() => {
        if (props.defaultSegmentedControlItem) {
            const defaultItem = props.defaultSegmentedControlItem
            const value = defaultItem.value || defaultItem.label || defaultItem.id || null
            setValue(value)
        }
    }, [props.defaultSegmentedControlItem])

    return (
        <SegmentedControl
            orientation={props.segmentedControlOrientation}
            value={value}
            data={data}
            onChange={setValue}
            {...props}
            {...props.customProps}
        />
    )
})