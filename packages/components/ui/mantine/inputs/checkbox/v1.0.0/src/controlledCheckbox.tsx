import { forwardRef, useImperativeHandle, useState } from "react"
import { Checkbox } from "@mantine/core"
import type { Props } from "../types"
import { sendOutput, sendSignal } from '@packages/port-send'
import convertColor from "@packages/convert-color"

export default forwardRef(function (props: Props, ref) {
    const Icon = props.iconName && R.libs.icons[props.iconName]

    const [checked, setChecked] = useState(false)
    useImperativeHandle(ref, () => ({
        reset() {
            setChecked(false)
            sendOutput(props.noodlNode, 'checked', false)
        }
    }), [])

    return <Checkbox
        error={props.inputError || false}
        icon={Icon && <Icon size={props.iconSize} stroke={props.iconStroke} color={convertColor(props.iconColor)} />}
        checked={checked}
        onChange={(event) => {
            setChecked(event.currentTarget.checked)
            sendOutput(props.noodlNode, 'checked', event.currentTarget.checked)
            sendSignal(props.noodlNode, 'changed')
        }}
        {...props}
        {...props.customProps}
    />
})
