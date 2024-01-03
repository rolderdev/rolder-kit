import { forwardRef, useState } from "react"
import { useShallowEffect } from "@mantine/hooks"
import { SegmentedControl } from "@mantine/core"
import converForSelectInputs from '../../../../../../../utils/converForSelectInputs/v0.2.0/converForSelectInputs'
import { getValue8 } from "@rk/utils"
import { sendOutput, sendSignal } from "@rk/node-fabrik"

export default forwardRef(function (props: any) {
    const [data, setData] = useState([])
    useShallowEffect(() => {
        const items = props.inputItems
        if (props.labelField && items?.some((i: any) => getValue8(i, props.labelField)))
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