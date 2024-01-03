import { forwardRef, useImperativeHandle, useState } from "react"
import icons from "../../../../../../../libs/icons/v0.2.0/icons"
import { useShallowEffect } from "@mantine/hooks"
import { Checkbox } from "@mantine/core"
import { getValue8 } from "@rk/utils"
import { sendOutput, sendSignal } from "@rk/node-fabrik"

export default forwardRef(function (props: any, ref) {
    const Icon = icons(props.iconName)

    const [checked, setChecked] = useState(false);
    const [label, setLabel] = useState('')
    useShallowEffect(() => {
        const label = getValue8(props.item, props.labelField)
        if (label) setLabel(label)
    }, [props])

    // reset
    useImperativeHandle(ref, () => ({
        reset() {
            setChecked(false)
            sendOutput(props.noodlNode, 'checked', false)
        }
    }), [])

    return (
        <Checkbox
            label={label}
            error={props.inputError || false}
            icon={Icon && <Icon size={props.iconSize} stroke={props.stroke} />}
            checked={checked}
            onChange={(event) => {
                setChecked(event.currentTarget.checked)
                sendOutput(props.noodlNode, 'checked', event.currentTarget.checked)
                sendSignal(props.noodlNode, 'changed')
            }}
            {...props}
            {...props.customProps}
        />
    )
})